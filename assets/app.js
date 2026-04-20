const DATA_ROOT = "/assets/data";

async function loadJSON(name) {
  const response = await fetch(`${DATA_ROOT}/${name}.json`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load ${name}.json`);
  return response.json();
}

function titleize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatPct(value, digits = 0) {
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

function formatNumber(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function setHTML(id, html) {
  const node = document.getElementById(id);
  if (node) node.innerHTML = html;
}

function groupBy(list, key) {
  return list.reduce((acc, item) => {
    const group = item[key];
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
}

function buildBarList(items) {
  return `
    <div class="bar-list">
      ${items
        .map(
          (item) => `
            <div class="bar-row">
              <div class="bar-label"><span>${titleize(item.label)}</span><strong>${formatPct(item.value, 1)}</strong></div>
              <div class="bar-track"><div class="bar-fill" style="width:${Math.max(0, Math.min(100, item.value * 100))}%"></div></div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function buildTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows
            .map(
              (row) => `<tr>${row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function buildMiniCards(items) {
  return `
    <div class="mini-grid">
      ${items
        .map(
          (item) => `
            <article class="mini-stat">
              <span class="section-tag">${item.label}</span>
              <h3>${item.value}</h3>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function lineChart(series, options = {}) {
  const width = options.width || 720;
  const height = options.height || 280;
  const padding = 36;
  const values = series.flatMap((item) => item.values.map((point) => point.value));
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const xCount = series[0]?.values.length || 0;
  const scaleX = (index) => padding + ((width - padding * 2) * index) / Math.max(1, xCount - 1);
  const scaleY = (value) =>
    height - padding - ((value - minY) * (height - padding * 2)) / Math.max(1e-9, maxY - minY);

  const lines = series
    .map((item) => {
      const points = item.values.map((point, index) => `${scaleX(index)},${scaleY(point.value)}`).join(" ");
      return `<polyline fill="none" stroke="${item.color}" stroke-width="3" points="${points}" />`;
    })
    .join("");

  const xLabels = [0, Math.floor((xCount - 1) / 2), xCount - 1]
    .filter((value, index, array) => value >= 0 && array.indexOf(value) === index)
    .map((index) => {
      const point = series[0].values[index];
      return `<text x="${scaleX(index)}" y="${height - 8}" text-anchor="middle" fill="#4d5b69" font-size="12">${formatDate(point.date)}</text>`;
    })
    .join("");

  const yLabels = [minY, (minY + maxY) / 2, maxY]
    .map(
      (value) =>
        `<text x="0" y="${scaleY(value) + 4}" fill="#4d5b69" font-size="12">${formatNumber(value)}</text>`
    )
    .join("");

  const legend = `
    <div class="chart-legend">
      ${series
        .map(
          (item) =>
            `<span class="legend-pill"><span class="legend-dot" style="background:${item.color}"></span>${item.label}</span>`
        )
        .join("")}
    </div>
  `;

  return `
    <div class="chart-shell">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart">
        <rect x="${padding}" y="${padding / 2}" width="${width - padding * 2}" height="${height - padding * 1.5}" fill="rgba(16,34,53,0.03)" rx="18"></rect>
        ${lines}
        ${xLabels}
        ${yLabels}
      </svg>
      ${legend}
    </div>
  `;
}

async function renderHome() {
  const latest = await loadJSON("latest");
  const history = await loadJSON("history");
  const summary = latest.summary;
  const current = summary.current_regime;
  const midHistoryRow = history[history.length - 1] || {};
  const roadmapSummary = latest.roadmap_summary || {};

  setHTML(
    "hero-summary",
    `
      <div class="summary-card profile-tile">
        <img src="/profile_git_jae.jpg" alt="Jaeseok Hwang" />
        <div>
          <span class="section-tag">Author</span>
          <h3>Jaeseok Hwang</h3>
          <p>Macro and quant research focused on Treasury regime shifts, curve behavior, and decision support.</p>
        </div>
      </div>
      <div class="summary-card">
        <span class="section-tag">Current regime</span>
        <h3>${titleize(current.mid.regime_id)}</h3>
        <div class="value">${formatPct(current.mid.probability, 1)}</div>
        <p>Mid-horizon dominant regime as of ${formatDate(summary.date)}.</p>
      </div>
      <div class="summary-card">
        <span class="section-tag">Dominant shock</span>
        <h3>${titleize(summary.shock_event.dominant_category)}</h3>
        <div class="value">${formatNumber(summary.shock_event.persistence_score, 2)}</div>
        <p>Persistence score through the ${titleize(summary.shock_event.transmission_channel)} channel.</p>
      </div>
    `
  );

  setHTML(
    "summary-grid",
    [
      {
        label: "Short-horizon strategy",
        value: titleize(summary.strategy.directional_view),
        body: `Curve bias: ${titleize(summary.strategy.curve_view)}.`,
      },
      {
        label: "Main risk",
        value: titleize(summary.strategy.main_risk),
        body: "The primary channel that can challenge the current Treasury view.",
      },
      {
        label: "2s10s",
        value: `${formatNumber(summary.curve_snapshot.curve_2s10s * 100, 1)} bp`,
        body: "Yesterday’s curve slope.",
      },
      {
        label: "Breakeven",
        value: `${formatNumber(summary.curve_snapshot.breakeven_10y, 2)}`,
        body: "10Y inflation compensation proxy.",
      },
      {
        label: "10Y VAR term premium",
        value: `${formatNumber(summary.curve_snapshot.term_premium_proxy_10y, 2)}`,
        body: "10Y yield minus a rolling VAR-style expected short-rate path.",
      },
      {
        label: "System roadmap",
        value: roadmapSummary.system_version || "v1",
        body: `${roadmapSummary.high_priority_count || 0} high-priority tracked upgrades in the version map.`,
      },
    ]
      .map(
        (card) => `
          <article class="summary-card">
            <span class="section-tag">${card.label}</span>
            <h3>${card.value}</h3>
            <p>${card.body}</p>
          </article>
        `
      )
      .join("")
  );

  setHTML(
    "executive-report",
    `
      <p><strong>Base case:</strong> ${titleize(current.mid.regime_id)} remains the dominant mid-horizon regime at ${formatPct(current.mid.probability, 1)}.</p>
      <p><strong>Immediate driver:</strong> the shock layer reads ${titleize(summary.shock_event.dominant_category)} through ${titleize(summary.shock_event.transmission_channel)}.</p>
      <p><strong>Treasury interpretation:</strong> ${summary.curve_decomposition.interpretation}</p>
      <p><strong>Desk implication:</strong> ${titleize(summary.strategy.directional_view)} with a ${titleize(summary.strategy.curve_view)} bias, while the main risk remains ${titleize(summary.strategy.main_risk)}.</p>
      <p><strong>Falsifier:</strong> ${summary.strategy.falsifier}</p>
    `
  );

  setHTML(
    "horizon-grid",
    buildMiniCards(
      ["short", "mid", "long"].map((horizon) => ({
        label: `${horizon} horizon`,
        value: titleize(current[horizon].regime_id),
        body: `Posterior ${formatPct(current[horizon].probability, 1)} for the ${horizon}-horizon dominant regime.`,
      }))
    )
  );

  setHTML(
    "risk-grid",
    buildMiniCards([
      {
        label: "10Y expected short rate",
        value: formatNumber(summary.curve_snapshot.expected_short_rate_proxy_10y, 2),
        body: "Rolling VAR-style expected short-rate path embedded in the 10Y sector.",
      },
      {
        label: "10Y term premium",
        value: formatNumber(summary.curve_snapshot.term_premium_proxy_10y, 2),
        body: "Residual long-end compensation after stripping out the expected short-rate path.",
      },
      {
        label: "10Y duration",
        value: formatNumber(summary.risk_measures.mod_duration_10y, 2),
        body: "Cash-flow-based modified duration using a semiannual par-bond approximation.",
      },
      {
        label: "10Y DV01",
        value: formatNumber(summary.risk_measures.dv01_10y, 4),
        body: "Dollar value of one basis point per 100 par in the 10Y benchmark risk frame.",
      },
    ])
  );

  setHTML(
    "shock-grid",
    buildMiniCards([
      {
        label: "Dominant shock",
        value: titleize(summary.shock_event.dominant_category),
        body: "Primary ex-post shock classification from official and market evidence.",
      },
      {
        label: "Persistence",
        value: formatNumber(summary.shock_event.persistence_score, 2),
        body: "Current estimate of how long the shock should keep shaping the regime path.",
      },
      {
        label: "Confidence",
        value: formatNumber(summary.shock_event.confidence_score, 2),
        body: "Confidence score on the current shock assignment.",
      },
      {
        label: "Policy uncertainty",
        value: formatNumber(summary.curve_decomposition.policy_uncertainty_score, 2),
        body: "Treasury-curve signal for medium-horizon policy confusion or paralysis.",
      },
    ])
  );

  const regimeBars = Object.keys(midHistoryRow)
    .filter((key) => key.startsWith("mid_") && !key.includes("dominant"))
    .map((key) => ({ label: key.replace("mid_", ""), value: Number(midHistoryRow[key]) }))
    .sort((a, b) => b.value - a.value);
  setHTML("regime-bars", buildBarList(regimeBars));

  const channelUpdates = (summary.channel_updates || [])
    .filter((item) => item.horizon === "mid")
    .map(
      (item) => `
        <div class="list-item">
          <strong>${titleize(item.channel_name)}</strong>
          <p class="muted">${item.notes}</p>
        </div>
      `
    )
    .join("");
  setHTML("channel-list", channelUpdates);

  const recentHistory = history.slice(-90);
  setHTML(
    "yield-chart",
    lineChart([
      {
        label: "2Y yield",
        color: "#c66a2b",
        values: recentHistory.map((row) => ({ date: row.date, value: Number(row.yield_2y) })),
      },
      {
        label: "10Y yield",
        color: "#102235",
        values: recentHistory.map((row) => ({ date: row.date, value: Number(row.yield_10y) })),
      },
    ])
  );

  setHTML(
    "curve-table",
    buildTable(
      ["Metric", "Level", "Daily change"],
      [
        ["2Y", formatNumber(summary.curve_snapshot.yield_2y, 2), `${formatNumber(summary.daily_changes.yield_2y_bp, 1)} bp`],
        ["10Y", formatNumber(summary.curve_snapshot.yield_10y, 2), `${formatNumber(summary.daily_changes.yield_10y_bp, 1)} bp`],
        ["2s10s", `${formatNumber(summary.curve_snapshot.curve_2s10s * 100, 1)} bp`, `${formatNumber(summary.daily_changes.curve_2s10s_bp, 1)} bp`],
        ["10Y breakeven", formatNumber(summary.curve_snapshot.breakeven_10y, 2), `${formatNumber(summary.daily_changes.breakeven_10y_bp, 1)} bp`],
        ["NS curvature", formatNumber(summary.curve_snapshot.ns_curvature, 2), "state"],
        ["10Y VAR term premium", formatNumber(summary.curve_snapshot.term_premium_proxy_10y, 2), `${formatNumber(summary.daily_changes.term_premium_proxy_10y_bp, 1)} bp`],
      ]
    )
  );

  const groupedPlayers = groupBy(latest.player_probabilities, "player_id");
  setHTML(
    "player-grid",
    Object.entries(groupedPlayers)
      .map(([playerId, rows]) => {
        const groupedHorizons = groupBy(rows, "horizon");
        return `
          <article class="player-card">
            <span class="section-tag">${titleize(playerId)}</span>
            <h3>${titleize(playerId)}</h3>
            <ul>
              ${Object.entries(groupedHorizons)
                .map(
                  ([horizon, actions]) =>
                    `<li><strong>${titleize(horizon)}:</strong> ${actions
                      .sort((a, b) => b.probability - a.probability)
                      .slice(0, 3)
                      .map((item) => `${titleize(item.action)} (${formatPct(item.probability, 0)})`)
                      .join(", ")}</li>`
                )
                .join("")}
            </ul>
          </article>
        `;
      })
      .join("")
  );

  setHTML(
    "source-table",
    latest.source_scorecard.length
      ? buildTable(
          ["Source", "Tracked", "D+1", "W+1", "M+1"],
          latest.source_scorecard.map((item) => [
            item.source_name,
            item.claims_tracked,
            formatNumber(item.d1_score, 2),
            formatNumber(item.w1_score, 2),
            formatNumber(item.m1_score, 2),
          ])
        )
      : `<p class="muted">Source scorecards will populate as the forecast-review memory builds.</p>`
  );

  setHTML(
    "thesis-note",
    `
      <p><strong>Yesterday’s move:</strong> 2Y ${formatNumber(summary.daily_changes.yield_2y_bp, 1)} bp, 10Y ${formatNumber(summary.daily_changes.yield_10y_bp, 1)} bp, 2s10s ${formatNumber(summary.daily_changes.curve_2s10s_bp, 1)} bp.</p>
      <p><strong>Current regime path:</strong> ${titleize(current.mid.regime_id)} remains dominant, with the shock layer reading ${titleize(summary.shock_event.dominant_category)}.</p>
      <p><strong>Curve math:</strong> Nelson-Siegel curvature is ${formatNumber(summary.curve_snapshot.ns_curvature, 2)}, and the 10Y VAR-style term-premium proxy is ${formatNumber(summary.curve_snapshot.term_premium_proxy_10y, 2)}.</p>
      <p><strong>Manager takeaway:</strong> the system is watching whether Treasury pricing keeps expressing a ${titleize(summary.strategy.main_risk)} story or rotates into a cleaner slowdown or re-anchoring path.</p>
      <p><strong>Falsifier:</strong> ${summary.strategy.falsifier}</p>
    `
  );
}

async function renderFramework() {
  const framework = await loadJSON("framework");
  setHTML(
    "regime-cards",
    framework.regimes
      .map(
        (regime) => `
          <article class="regime-card">
            <span class="badge">${titleize(regime.regime_family)}</span>
            <h3>${titleize(regime.regime_name)}</h3>
            <p class="muted">${regime.economic_definition}</p>
            <p class="muted"><strong>Treasury signature:</strong> ${regime.treasury_signature.join("; ")}</p>
          </article>
        `
      )
      .join("")
  );

  const headers = ["From / To", ...framework.regimes.map((regime) => titleize(regime.regime_id))];
  const rows = Object.entries(framework.transition_matrix).map(([from, row]) => [
    titleize(from),
    ...framework.regimes.map((regime) => formatPct(row[regime.regime_id] || 0, 0)),
  ]);
  setHTML("transition-matrix", buildTable(headers, rows));
}

async function renderRoadmap() {
  const roadmap = await loadJSON("roadmap");
  const hierarchy = roadmap.hierarchy || [];
  const upgrades = hierarchy.flatMap((layer) =>
    (layer.next_upgrades || []).map((upgrade) => ({
      ...upgrade,
      layer_title: layer.title,
      layer_order: layer.order,
    }))
  );

  const priorityRank = { high: 0, medium: 1, low: 2 };
  upgrades.sort((a, b) => {
    const byPriority = (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
    if (byPriority !== 0) return byPriority;
    return (a.layer_order || 99) - (b.layer_order || 99);
  });

  setHTML(
    "roadmap-summary",
    [
      {
        label: "Version",
        value: roadmap.system_version || "v1",
        body: roadmap.version_label || "Tracked research system version.",
      },
      {
        label: "Layers",
        value: String(hierarchy.length),
        body: "Architectural layers in the current research stack.",
      },
      {
        label: "High priority",
        value: String(upgrades.filter((item) => item.priority === "high").length),
        body: "Upgrades that should shape the next research pass.",
      },
      {
        label: "In progress",
        value: String(upgrades.filter((item) => item.status === "in_progress").length),
        body: "Tracked improvements already underway.",
      },
    ]
      .map(
        (card) => `
          <article class="summary-card">
            <span class="section-tag">${card.label}</span>
            <h3>${card.value}</h3>
            <p>${card.body}</p>
          </article>
        `
      )
      .join("")
  );

  setHTML(
    "roadmap-layers",
    hierarchy
      .sort((a, b) => (a.order || 99) - (b.order || 99))
      .map(
        (layer) => `
          <article class="regime-card">
            <span class="badge">Layer ${layer.order}</span>
            <h3>${layer.title}</h3>
            <p class="muted">${layer.role}</p>
            <p class="muted"><strong>Status:</strong> ${titleize(layer.current_status)}</p>
            <p class="muted"><strong>V1 scope:</strong></p>
            <ul class="bullet-list">
              ${(layer.v1_scope || []).map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <p class="muted"><strong>Known problems:</strong></p>
            <ul class="bullet-list">
              ${(layer.known_problems || []).map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("")
  );

  setHTML(
    "roadmap-upgrades",
    buildTable(
      ["Layer", "Upgrade", "Priority", "Status", "Success metric"],
      upgrades.map((item) => [
        item.layer_title,
        `<strong>${item.upgrade_id}</strong><br />${item.title}<br /><span class="muted">${item.planned_change}</span>`,
        titleize(item.priority),
        titleize(item.status),
        item.success_metric,
      ])
    )
  );

  const cadence = roadmap.review_cadence || {};
  setHTML(
    "roadmap-rules",
    `
      <p><strong>Purpose:</strong> ${roadmap.purpose || ""}</p>
      <p><strong>Maintenance rule:</strong> ${roadmap.maintenance_rule || ""}</p>
      <p><strong>Daily:</strong> ${cadence.daily || ""}</p>
      <p><strong>Weekly:</strong> ${cadence.weekly || ""}</p>
      <p><strong>Monthly:</strong> ${cadence.monthly || ""}</p>
    `
  );
}

async function renderArchive() {
  const archive = await loadJSON("archive");
  const notes = archive.notes || [];
  const review = archive.regime_review || [];
  const missSummary = archive.miss_summary || [];

  setHTML(
    "archive-table",
    buildTable(
      ["Date", "Short", "Mid", "Shock", "2Y", "10Y"],
      notes.slice(0, 40).map((item) => [
        formatDate(item.date),
        titleize(item.short_dominant_regime),
        titleize(item.mid_dominant_regime),
        titleize(item.dominant_category),
        formatNumber(item.yield_2y, 2),
        formatNumber(item.yield_10y, 2),
      ])
    )
  );

  const groupedReview = groupBy(review, "target_horizon");
  setHTML(
    "review-table",
    Object.keys(groupedReview).length
      ? buildTable(
          ["Horizon", "Observations", "Avg directional accuracy"],
          Object.entries(groupedReview).map(([horizon, rows]) => {
            const avg = rows.reduce((sum, row) => sum + Number(row.directional_accuracy || 0), 0) / rows.length;
            return [titleize(horizon), rows.length, formatPct(avg, 0)];
          })
        )
      : `<p class="muted">Review statistics will build as the archive deepens.</p>`
  );

  setHTML(
    "miss-table",
    missSummary.length
      ? buildTable(
          ["Horizon", "Miss type", "Observations", "Avg directional accuracy"],
          missSummary.map((item) => [
            titleize(item.target_horizon),
            titleize(item.miss_type),
            item.observations,
            formatPct(item.avg_directional_accuracy, 0),
          ])
        )
      : `<p class="muted">Miss taxonomy statistics will populate as the review archive builds.</p>`
  );
}

async function boot() {
  const page = document.body.dataset.page;
  if (page === "home") await renderHome();
  if (page === "framework") await renderFramework();
  if (page === "roadmap") await renderRoadmap();
  if (page === "archive") await renderArchive();
}

boot().catch((error) => {
  console.error(error);
});
