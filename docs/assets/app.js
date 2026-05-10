const DATA_ROOT = "/assets/data";

async function loadJSON(name) {
  const response = await fetch(`${DATA_ROOT}/${name}.json`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load ${name}.json`);
  return response.json();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function titleize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatPct(value, digits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "n/a";
  return `${(number * 100).toFixed(digits)}%`;
}

function formatNumber(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "n/a";
  return number.toFixed(digits);
}

function formatSigned(value, digits = 1, suffix = "") {
  const number = Number(value);
  if (!Number.isFinite(number)) return "n/a";
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(digits)}${suffix}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function setRoot(html) {
  const node = document.getElementById("app-root");
  if (node) node.innerHTML = html;
}

function topActionsByPlayer(rows) {
  const grouped = {};
  for (const row of rows || []) {
    const player = row.player_id;
    const horizon = row.horizon;
    grouped[player] = grouped[player] || {};
    grouped[player][horizon] = grouped[player][horizon] || [];
    grouped[player][horizon].push(row);
  }
  Object.values(grouped).forEach((playerGroup) => {
    Object.values(playerGroup).forEach((list) => list.sort((a, b) => Number(b.probability || 0) - Number(a.probability || 0)));
  });
  return grouped;
}

function metricGrid(items) {
  return `
    <div class="metric-grid">
      ${items
        .map(
          (item) => `
            <article class="metric-card">
              <div class="metric-key">${escapeHtml(item.label)}</div>
              <div class="metric-value ${item.tone || ""}">${escapeHtml(item.value)}</div>
              ${item.note ? `<div class="metric-note">${escapeHtml(item.note)}</div>` : ""}
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderProgressRows(items) {
  return `
    <div class="progress-list">
      ${items
        .map((item) => {
          const width = Math.max(4, Math.min(100, Number(item.value || 0) * 100));
          return `
            <div class="progress-row">
              <div class="progress-meta">
                <span>${escapeHtml(item.label)}</span>
                <strong>${formatPct(item.value, 1)}</strong>
              </div>
              <div class="progress-track"><span style="width:${width}%"></span></div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderKeyValueTable(rows) {
  return `
    <table class="terminal-table">
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <th>${escapeHtml(row.label)}</th>
                <td>${row.value}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderSectionBlock(title, eyebrow, body) {
  return `
    <section class="terminal-panel">
      <div class="panel-eyebrow">${escapeHtml(eyebrow)}</div>
      <h2 class="panel-title">${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

function renderSnapshot(summary, history, latest) {
  const mid = summary.current_regime?.mid || {};
  const short = summary.current_regime?.short || {};
  const long = summary.current_regime?.long || {};
  const curve = summary.curve_snapshot || {};
  const daily = summary.daily_changes || {};
  const shock = summary.shock_event || {};
  const strategy = summary.strategy || {};
  const econMid = summary.economy_state?.mid || {};
  const econStatusMid = summary.economy_status?.mid || {};
  const cov = summary.covariance_monitor?.mid || {};
  const players = topActionsByPlayer(latest.player_probabilities || []);
  const dealer = players.sell_side || {};
  const buyside = players.buy_side || {};

  const hero = `
    <section class="hero-grid">
      <article class="terminal-panel hero-panel">
        <div class="panel-eyebrow">LIVE SNAPSHOT</div>
        <h1 class="hero-title">CURRENT TREASURY REGIME // EVENT-CONDITIONED NOWCAST</h1>
        <p class="hero-copy">
          Objective: map the current Treasury regime through explicit market state, hidden covariance,
          player nowcast, and residual puzzle. This is a Treasury-first research terminal, not a
          generic macro commentary page.
        </p>
        <div class="status-line">
          <span>DATE ${escapeHtml(formatDate(summary.date))}</span>
          <span>WAR ANCHOR ${escapeHtml(summary.war_anchor_date || "2025-06-21")}</span>
          <span>MODEL ${escapeHtml(summary.model_framework || "n/a")}</span>
        </div>
      </article>
      <article class="terminal-panel focus-panel">
        <div class="panel-eyebrow">CURRENT STATE</div>
        <div class="focus-regime">${escapeHtml(titleize(mid.regime_id))}</div>
        <div class="focus-prob">${formatPct(mid.probability, 1)}</div>
        <div class="focus-subline">MID-HORIZON DOMINANT REGIME</div>
        <div class="focus-remaining">REMAINING MASS ${formatPct(mid.remaining_probability_mass, 1)}</div>
        <div class="focus-note">
          Dominant axis ${escapeHtml(titleize(econStatusMid.dominant_axis || "unknown"))} //
          status ${escapeHtml(titleize(econStatusMid.status || "unknown"))} //
          dispersion ${formatNumber(econStatusMid.dispersion, 2)}
        </div>
      </article>
    </section>
  `;

  const regimeBoard = renderSectionBlock(
    "Regime State Matrix",
    "REGIME",
    metricGrid([
      { label: "Short horizon", value: `${titleize(short.regime_id)} // ${formatPct(short.probability, 1)}` },
      { label: "Mid horizon", value: `${titleize(mid.regime_id)} // ${formatPct(mid.probability, 1)}` },
      { label: "Long horizon", value: `${titleize(long.regime_id)} // ${formatPct(long.probability, 1)}` },
      { label: "Directional view", value: titleize(strategy.directional_view) },
      { label: "Curve view", value: titleize(strategy.curve_view) },
      { label: "Main risk", value: titleize(strategy.main_risk) }
    ])
  );

  const snapshotBoard = renderSectionBlock(
    "Today's Snapshot",
    "EXPLICIT CURVE LAYER",
    metricGrid([
      { label: "2Y", value: `${formatNumber(curve.yield_2y, 2)}%`, note: formatSigned(daily.yield_2y_bp, 1, " bp") },
      { label: "10Y", value: `${formatNumber(curve.yield_10y, 2)}%`, note: formatSigned(daily.yield_10y_bp, 1, " bp") },
      { label: "30Y", value: `${formatNumber(curve.yield_30y, 2)}%`, note: formatSigned(daily.yield_30y_bp, 1, " bp") },
      { label: "2s10s", value: `${formatNumber(Number(curve.curve_2s10s) * 100, 1)} bp`, note: formatSigned(daily.curve_2s10s_bp, 1, " bp") },
      { label: "5s30s", value: `${formatNumber(Number(curve.curve_5s30s) * 100, 1)} bp`, note: formatSigned(daily.curve_5s30s_bp, 1, " bp") },
      { label: "2s5s10s fly", value: `${formatNumber(curve.fly_2s5s10s, 1)} bp`, note: "belly distortion" },
      { label: "10Y breakeven", value: `${formatNumber(curve.breakeven_10y, 2)}%`, note: formatSigned(daily.breakeven_10y_bp, 1, " bp") },
      { label: "10Y real", value: `${formatNumber(curve.real_10y, 2)}%`, note: formatSigned(daily.real_10y_bp, 1, " bp") },
      { label: "SOFR-FF", value: `${formatNumber(Number(curve.sofr_minus_ff) * 100, 1)} bp`, note: formatSigned(daily.sofr_minus_ff_bp, 1, " bp") },
      { label: "Term premium", value: `${formatNumber(curve.term_premium_proxy_10y, 2)}%`, note: formatSigned(daily.term_premium_proxy_10y_bp, 1, " bp") }
    ])
  );

  const covarianceBoard = renderSectionBlock(
    "Covariance Monitor",
    "HIDDEN STRUCTURE",
    `
      ${metricGrid([
        { label: "Trace 60d", value: formatNumber(cov.trace_60d, 2) },
        { label: "Eig1 share", value: formatPct(cov.eig1_share_60d, 1) },
        { label: "Abs mean", value: formatNumber(cov.abs_mean_60d, 2) },
        { label: "Shift Fro", value: formatNumber(cov.shift_fro_60d, 2) },
        { label: "Inflation / rates", value: formatNumber(cov.inflation_rates_cov_60d, 2) },
        { label: "Growth / risk", value: formatNumber(cov.growth_risk_cov_60d, 2) },
        { label: "Funding / risk", value: formatNumber(cov.funding_risk_cov_60d, 2) },
        { label: "Signal count", value: String((cov.signal_columns || []).length) }
      ])}
      <div class="subpanel-grid">
        <article class="subpanel">
          <div class="subpanel-title">Top covariance pairs</div>
          ${renderKeyValueTable(
            (cov.top_covariance_pairs || []).slice(0, 5).map((pair) => ({
              label: `${titleize(pair.left)} x ${titleize(pair.right)}`,
              value: formatNumber(pair.covariance, 2)
            }))
          )}
        </article>
        <article class="subpanel">
          <div class="subpanel-title">Mid-horizon state vector</div>
          ${renderProgressRows([
            { label: "Inflation", value: econMid.inflation },
            { label: "Growth drag", value: econMid.growth_drag },
            { label: "Market stress", value: econMid.market_stress },
            { label: "Liquidity stress", value: Math.max(0, econMid.liquidity_stress || 0) }
          ])}
        </article>
      </div>
    `
  );

  const playerBoard = renderSectionBlock(
    "Player Nowcast",
    "ROLEBOOK OUTPUT",
    `
      <div class="subpanel-grid">
        <article class="subpanel">
          <div class="subpanel-title">Sell-side / dealer bias</div>
          ${["short", "mid", "long"]
            .map((horizon) => {
              const top = (dealer[horizon] || [])[0];
              return top
                ? `<div class="player-line"><span>${titleize(horizon)}</span><strong>${titleize(top.action)}</strong><em>${formatPct(top.probability, 1)}</em></div>`
                : "";
            })
            .join("")}
        </article>
        <article class="subpanel">
          <div class="subpanel-title">Buy-side bias</div>
          ${["short", "mid", "long"]
            .map((horizon) => {
              const top = (buyside[horizon] || [])[0];
              return top
                ? `<div class="player-line"><span>${titleize(horizon)}</span><strong>${titleize(top.action)}</strong><em>${formatPct(top.probability, 1)}</em></div>`
                : "";
            })
            .join("")}
        </article>
        <article class="subpanel">
          <div class="subpanel-title">Shock and policy context</div>
          ${renderKeyValueTable([
            { label: "Shock", value: titleize(shock.dominant_category) },
            { label: "Source actor", value: titleize(shock.source_actor) },
            { label: "Severity", value: formatNumber(shock.severity_score, 2) },
            { label: "Persistence", value: formatNumber(shock.persistence_score, 2) },
            { label: "Confidence", value: formatNumber(shock.confidence_score, 2) }
          ])}
        </article>
      </div>
    `
  );

  const objectiveBoard = renderSectionBlock(
    "Objective and Falsifier",
    "RESEARCH LOGIC",
    `
      <div class="terminal-copy">
        <p>
          This terminal studies the current regime through a separated numeric world, narrative world,
          and residual puzzle world. The goal is to identify which hidden factor mix is active now,
          which player behavior is likely, and what remains unresolved.
        </p>
        <p>
          <strong>Falsifier:</strong> ${escapeHtml(strategy.falsifier || "No falsifier recorded.")}
        </p>
      </div>
    `
  );

  return `
    ${hero}
    <div class="terminal-grid terminal-grid-2">
      ${regimeBoard}
      ${snapshotBoard}
    </div>
    <div class="terminal-grid terminal-grid-2">
      ${covarianceBoard}
      ${playerBoard}
    </div>
    ${objectiveBoard}
  `;
}

function renderSchemaPage() {
  const schema = window.SITE_SCHEMA_DATA?.schema;
  if (!schema) throw new Error("Schema data missing.");
  return `
    <section class="terminal-panel hero-panel">
      <div class="panel-eyebrow">SCHEMA</div>
      <h1 class="hero-title">${escapeHtml(schema.title)}</h1>
      <p class="hero-copy">${escapeHtml(schema.summary)}</p>
    </section>
    <div class="schema-stack">
      ${schema.sections
        .map(
          (section) => `
            <section class="terminal-panel">
              <div class="panel-eyebrow">${escapeHtml(section.label)}</div>
              <div class="schema-list">
                ${section.items
                  .map(
                    (item) => `
                      <article class="schema-item">
                        <div class="schema-key">- ${escapeHtml(item.title)}</div>
                        <div class="schema-body">${escapeHtml(item.body)}</div>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function renderWorkflowPage() {
  const workflow = window.SITE_SCHEMA_DATA?.workflow;
  if (!workflow) throw new Error("Workflow data missing.");
  return `
    <section class="terminal-panel hero-panel">
      <div class="panel-eyebrow">WORKFLOW // STEP 1 TO STEP 8</div>
      <h1 class="hero-title">${escapeHtml(workflow.title)}</h1>
      <p class="hero-copy">${escapeHtml(workflow.summary)}</p>
    </section>
    <div class="workflow-stack">
      ${workflow.steps
        .map(
          (step) => `
            <section class="terminal-panel workflow-step">
              <div class="workflow-step-head">
                <span class="step-id">${escapeHtml(step.id)}</span>
                <h2 class="panel-title">${escapeHtml(step.title)}</h2>
              </div>
              <p class="terminal-copy">${escapeHtml(step.objective)}</p>
              <div class="subpanel-grid">
                <article class="subpanel">
                  <div class="subpanel-title">Inputs</div>
                  <ul class="terminal-list">
                    ${step.inputs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                  </ul>
                </article>
                <article class="subpanel">
                  <div class="subpanel-title">Outputs</div>
                  <ul class="terminal-list">
                    ${step.outputs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                  </ul>
                </article>
              </div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function renderPrimerPage() {
  const primer = window.HIDDEN_LAYER_PRIMER;
  if (!primer || !Array.isArray(primer.layers)) {
    throw new Error("Primer data missing.");
  }

  return `
    <section class="terminal-panel hero-panel">
      <div class="panel-eyebrow">PRIMER</div>
      <h1 class="hero-title">${escapeHtml(primer.title || "Hidden Layer Primer")}</h1>
      <p class="hero-copy">${escapeHtml(primer.introduction || "")}</p>
    </section>
    <div class="terminal-grid terminal-grid-sidebar">
      <aside class="terminal-panel sticky-panel">
        <div class="panel-eyebrow">CONTENTS</div>
        <ul class="toc-list">
          ${primer.layers
            .map(
              (layer) => `
                <li><a href="#${escapeHtml(layer.id)}">${escapeHtml(layer.number)} // ${escapeHtml(layer.title)}</a></li>
              `
            )
            .join("")}
        </ul>
      </aside>
      <div class="content-stack">
        ${primer.layers
          .map(
            (layer) => `
              <section class="terminal-panel" id="${escapeHtml(layer.id)}">
                <div class="panel-eyebrow">${escapeHtml(layer.number)} // ${escapeHtml(layer.strapline)}</div>
                <h2 class="panel-title">${escapeHtml(layer.title)}</h2>
                <div class="subpanel-grid">
                  <article class="subpanel">
                    <div class="subpanel-title">Definition</div>
                    <p class="terminal-copy">${escapeHtml(layer.definition)}</p>
                  </article>
                  <article class="subpanel">
                    <div class="subpanel-title">Why the desk cares</div>
                    <p class="terminal-copy">${escapeHtml(layer.whyDeskCares)}</p>
                  </article>
                </div>
                <article class="subpanel">
                  <div class="subpanel-title">Implications</div>
                  <ul class="terminal-list">
                    ${(layer.implications || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                  </ul>
                </article>
                <article class="subpanel">
                  <div class="subpanel-title">Terminology</div>
                  <div class="schema-list">
                    ${(layer.terminology || [])
                      .map(
                        (item) => `
                          <div class="schema-item">
                            <div class="schema-key">- ${escapeHtml(item.term)}</div>
                            <div class="schema-body">${escapeHtml(item.meaning)} // DESK READ: ${escapeHtml(item.deskRead)}</div>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                </article>
                <article class="subpanel">
                  <div class="subpanel-title">Desk variables</div>
                  <div class="schema-list">
                    ${(layer.deskVariables || [])
                      .map(
                        (item) => `
                          <div class="schema-item">
                            <div class="schema-key">- ${escapeHtml(item.name)}</div>
                            <div class="schema-body">${escapeHtml(item.description)} // WHY: ${escapeHtml(item.whyItMatters)}</div>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                </article>
                <article class="subpanel">
                  <div class="subpanel-title">Public instruments</div>
                  <table class="terminal-table">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Frequency</th>
                        <th>What it captures</th>
                        <th>Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(layer.publicInstruments || [])
                        .map(
                          (item) => `
                            <tr>
                              <th><a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">${escapeHtml(item.source)}</a></th>
                              <td>${escapeHtml(item.frequency)}</td>
                              <td>${escapeHtml(item.use)}</td>
                              <td>${escapeHtml(item.gap)}</td>
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </article>
                <article class="subpanel">
                  <div class="subpanel-title">Research use</div>
                  <p class="terminal-copy">${escapeHtml(layer.researchUse)}</p>
                </article>
              </section>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderArchivePage(archive) {
  const notes = archive.notes || [];
  const miss = archive.miss_summary || [];
  return `
    <section class="terminal-panel hero-panel">
      <div class="panel-eyebrow">ARCHIVE</div>
      <h1 class="hero-title">Historical snapshots, regime review, and miss taxonomy.</h1>
      <p class="hero-copy">
        This page is the slow memory of the terminal. It shows how regime probabilities, shocks,
        covariance state, and review outcomes evolved through time.
      </p>
    </section>
    <div class="terminal-grid terminal-grid-2">
      <section class="terminal-panel">
        <div class="panel-eyebrow">RECENT NOTES</div>
        <h2 class="panel-title">Latest daily records</h2>
        <table class="terminal-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mid regime</th>
              <th>Prob</th>
              <th>Shock</th>
              <th>2Y</th>
              <th>10Y</th>
            </tr>
          </thead>
          <tbody>
            ${notes
              .slice(0, 14)
              .map(
                (row) => `
                  <tr>
                    <td>${escapeHtml(formatDate(row.date))}</td>
                    <td>${escapeHtml(titleize(row.mid_dominant_regime))}</td>
                    <td>${formatPct(row.mid_dominant_probability, 1)}</td>
                    <td>${escapeHtml(titleize(row.dominant_category))}</td>
                    <td>${formatNumber(row.yield_2y, 2)}</td>
                    <td>${formatNumber(row.yield_10y, 2)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </section>
      <section class="terminal-panel">
        <div class="panel-eyebrow">MISS TAXONOMY</div>
        <h2 class="panel-title">Why the model was wrong</h2>
        <table class="terminal-table">
          <thead>
            <tr>
              <th>Horizon</th>
              <th>Miss type</th>
              <th>Obs</th>
              <th>Avg accuracy</th>
            </tr>
          </thead>
          <tbody>
            ${miss
              .map(
                (row) => `
                  <tr>
                    <td>${escapeHtml(titleize(row.target_horizon))}</td>
                    <td>${escapeHtml(titleize(row.miss_type))}</td>
                    <td>${escapeHtml(String(row.observations))}</td>
                    <td>${formatPct(row.avg_directional_accuracy, 0)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </section>
    </div>
  `;
}

function renderSpan2Page() {
  const portfolioRows = [
    ["1", "ES", "FUT", "-", "-", "0.25", "6", "50", "$1,635,715"],
    ["2", "ES", "OPT", "Put", "5100", "0.25", "-12", "50", "-$37,353"],
    ["3", "NQ", "OPT", "Call", "18750", "0.18", "5", "20", "$91"],
    ["4", "CL", "FUT", "-", "-", "0.10", "-4", "1000", "-$500,982"],
    ["5", "CL", "OPT", "Call", "85", "0.10", "-8", "1000", "-$320,524"]
  ];

  const methodRows = [
    ["Historical HVaR", "Full repricing using historical market moves", "$107,778"],
    ["Parametric VaR", "Delta-vega covariance approximation", "$105,563"],
    ["Monte Carlo VaR", "Simulated correlated price and volatility shocks", "$109,179"],
    ["Legacy SPAN Approx.", "Fixed scan-risk style benchmark", "$238,380"]
  ];

  const stressRows = [
    ["Crude crash", "-25% price, +20 vol points", "$649,365"],
    ["Pure vol shock", "0% price, +25 vol points", "$130,083"],
    ["Custom sidebar shock", "-10% price, +5 vol points", "-$57,454"],
    ["Crude spike", "+18% price, +15 vol points", "-$114,719"]
  ];

  const greekRows = [
    ["Delta", "First-order futures price exposure", "HVaR sanity check, parametric VaR, scenario explanation"],
    ["Gamma", "Curvature when futures price moves", "Option non-linearity check under large shocks"],
    ["Vega", "Implied volatility exposure", "Vol shock stress and parametric VaR"],
    ["Theta", "Time-decay exposure", "Daily P&L attribution and roll-forward checks"]
  ];

  const table = (headings, rows) => `
    <div class="terminal-table-wrap">
      <table class="terminal-table">
        <thead>
          <tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? "th" : "td"}>${escapeHtml(cell)}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  return `
    <section class="hero-grid">
      <article class="terminal-panel hero-panel">
        <div class="panel-eyebrow">SPAN2 BENCHMARK // FUTURES AND OPTIONS MARGIN</div>
        <h1 class="hero-title">CME-style HVaR risk terminal for portfolio repricing.</h1>
        <p class="hero-copy">
          This page summarizes the Python Streamlit benchmark in a static website format. The desk workflow is:
          load today portfolio, mark futures and options, reprice options with Black-76, generate historical,
          parametric, Monte Carlo, and stress losses, then combine HVaR with stress, liquidity, and concentration add-ons.
        </p>
        <div class="risk-flow">
          <span>Portfolio</span>
          <span>Market data</span>
          <span>Black-76</span>
          <span>Scenario loss</span>
          <span>VaR methods</span>
          <span>Margin add-ons</span>
        </div>
      </article>
      <article class="terminal-panel focus-panel">
        <div class="panel-eyebrow">BENCHMARK OUTPUT</div>
        <div class="focus-regime">SPAN 2 MARGIN</div>
        <div class="focus-prob">$277,605</div>
        <div class="focus-subline">PEDAGOGICAL DEMO, NOT CME PRODUCTION METHODOLOGY</div>
        <div class="focus-note">Portfolio value $776,947 // 99% confidence // sample futures/options account</div>
      </article>
    </section>

    <div class="terminal-grid terminal-grid-2">
      ${renderSectionBlock(
        "Margin Components",
        "RISK STACK",
        metricGrid([
          { label: "Historical HVaR", value: "$107,778", note: "Empirical tail loss from historical scenarios" },
          { label: "Stress add-on", value: "$162,341", note: "Severe deterministic shock reserve" },
          { label: "Liquidity add-on", value: "$6,207", note: "Exit-cost proxy from notional exposure" },
          { label: "Concentration add-on", value: "$1,280", note: "Penalty for ES exposure above threshold" }
        ])
      )}
      ${renderSectionBlock(
        "Core Equation",
        "MARGIN LOGIC",
        `
          <div class="equation-card">Margin = HVaR + Stress + Liquidity + Concentration</div>
          <p class="terminal-copy">
            HVaR captures ordinary historical tail loss. Stress captures extreme but plausible market breaks.
            Liquidity captures the cost of exiting large positions. Concentration captures the extra risk of a
            portfolio crowded in one product, expiry, or direction.
          </p>
        `
      )}
    </div>

    ${renderSectionBlock(
      "Current Portfolio",
      "TODAY'S POSITIONS",
      table(["ID", "Product", "Type", "Option", "Strike", "Expiry", "Qty", "Size", "Value"], portfolioRows)
    )}

    <div class="terminal-grid terminal-grid-2">
      ${renderSectionBlock(
        "VaR Method Comparison",
        "HVAR ENGINE",
        table(["Method", "Mechanism", "Risk"], methodRows)
      )}
      ${renderSectionBlock(
        "Stress Scenarios",
        "BAD STATE CHECK",
        table(["Scenario", "Shock", "Loss"], stressRows)
      )}
    </div>

    <div class="terminal-grid terminal-grid-2">
      ${renderSectionBlock(
        "Greeks Used",
        "MODEL VALIDATION",
        table(["Greek", "Meaning", "Use in this research demo"], greekRows)
      )}
      ${renderSectionBlock(
        "Desk Workflow",
        "IMPLEMENTATION MAP",
        `
          <ol class="terminal-list">
            <li>Read current portfolio rows: product, instrument type, option type, strike, expiry, quantity, and contract size.</li>
            <li>Join market data: futures settlement, option implied volatility, interest rate, and expiry metadata.</li>
            <li>Price futures directly and price options with Black-76 using today&apos;s market state.</li>
            <li>Generate scenario states from historical, parametric, Monte Carlo, and stress methods.</li>
            <li>Fully reprice the same portfolio under each scenario and compute loss versus today.</li>
            <li>Take the tail quantile, add stress/liquidity/concentration reserves, and report benchmark margin.</li>
          </ol>
        `
      )}
    </div>
  `;
}

async function boot() {
  const page = document.body.dataset.page;

  if (page === "snapshot") {
    const latest = await loadJSON("latest");
    const history = await loadJSON("history");
    setRoot(renderSnapshot(latest.summary || {}, history, latest));
    return;
  }

  if (page === "schema") {
    setRoot(renderSchemaPage());
    return;
  }

  if (page === "workflow") {
    setRoot(renderWorkflowPage());
    return;
  }

  if (page === "primer") {
    setRoot(renderPrimerPage());
    return;
  }

  if (page === "archive") {
    const archive = await loadJSON("archive");
    setRoot(renderArchivePage(archive));
    return;
  }

  if (page === "span2") {
    setRoot(renderSpan2Page());
    return;
  }

  setRoot(`
    <section class="terminal-panel">
      <div class="panel-eyebrow">ERROR</div>
      <h1 class="hero-title">Unknown page mode</h1>
    </section>
  `);
}

boot().catch((error) => {
  console.error(error);
  setRoot(`
    <section class="terminal-panel">
      <div class="panel-eyebrow">LOAD ERROR</div>
      <h1 class="hero-title">The terminal could not render.</h1>
      <p class="hero-copy">${escapeHtml(error?.message || "Unknown error.")}</p>
    </section>
  `);
});
