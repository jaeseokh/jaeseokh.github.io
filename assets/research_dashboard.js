(function () {
  const assetOrder = ["2Y", "10Y", "2s10s", "Breakeven", "Credit", "USD", "Equity", "Vol", "Oil"];
  const directionSymbol = { up: "↑", down: "↓", flat: "→" };

  function titleCase(value) {
    return String(value || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function pct(value) {
    return `${(Number(value) * 100).toFixed(1)}%`;
  }

  function num(value, digits = 2) {
    return Number(value).toFixed(digits);
  }

  function signed(value, digits = 2) {
    const number = Number(value);
    const formatted = Math.abs(number).toFixed(digits);
    return `${number > 0 ? "+" : number < 0 ? "-" : ""}${formatted}`;
  }

  function noteClass(tone) {
    if (tone === "positive") return "tone-up";
    if (tone === "negative") return "tone-down";
    return "tone-flat";
  }

  function assetChip(label, payload) {
    const direction = payload?.direction || "flat";
    const source = payload?.source || "unknown";
    return `
      <span class="asset-chip ${direction} ${source === "heuristic" ? "heuristic" : ""}">
        <span class="asset-chip-label">${label}</span>
        <span class="asset-chip-symbol">${directionSymbol[direction] || "·"}</span>
      </span>
    `;
  }

  function renderNode(node, extraClass = "") {
    return `
      <button class="scenario-node ${extraClass}" data-node-id="${node.id}">
        <div class="scenario-node-head">
          <span class="scenario-node-title">${titleCase(node.scenario)}</span>
          <span class="scenario-node-prob">${pct(node.probability)}</span>
        </div>
        <div class="scenario-node-tag">${titleCase(node.tag)}</div>
        <div class="scenario-node-assets">
          ${assetOrder.map((asset) => assetChip(asset, node.asset_directions?.[asset])).join("")}
        </div>
      </button>
    `;
  }

  function renderProbabilityBars(probabilities) {
    return probabilities
      .map(
        (item) => `
          <div class="prob-row">
            <div class="prob-row-head">
              <span>${titleCase(item.scenario)}</span>
              <span>${pct(item.probability)}</span>
            </div>
            <div class="prob-bar-track">
              <div class="prob-bar-fill" style="width:${Math.max(3, item.probability * 100)}%"></div>
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderHeatmap(heatmap) {
    const labels = heatmap.variables;
    const rows = heatmap.values
      .map((row, rowIndex) => {
        const cells = row
          .map((value) => {
            const tone = value > 0.35 ? "positive" : value < -0.35 ? "negative" : "neutral";
            return `<div class="heatmap-cell ${tone}">${num(value, 2)}</div>`;
          })
          .join("");
        return `
          <div class="heatmap-row">
            <div class="heatmap-row-label">${labels[rowIndex]}</div>
            <div class="heatmap-row-cells">${cells}</div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="heatmap-grid">
        <div class="heatmap-header-spacer"></div>
        <div class="heatmap-header">${labels.map((label) => `<div class="heatmap-col-label">${label}</div>`).join("")}</div>
        ${rows}
      </div>
    `;
  }

  function nsLoadingSlope(maturity, lambdaValue) {
    const scaled = lambdaValue * maturity;
    if (Math.abs(scaled) < 1e-9) return 1;
    return (1 - Math.exp(-scaled)) / scaled;
  }

  function nsLoadingCurvature(maturity, lambdaValue) {
    const scaled = lambdaValue * maturity;
    if (Math.abs(scaled) < 1e-9) return 0;
    return nsLoadingSlope(maturity, lambdaValue) - Math.exp(-scaled);
  }

  function fittedCurvePoints(curveStateSummary) {
    const factors = curveStateSummary?.factors;
    if (!curveStateSummary?.available || !factors) return [];
    const maturities = [
      { label: "3M", years: 0.25 },
      { label: "6M", years: 0.5 },
      { label: "1Y", years: 1 },
      { label: "2Y", years: 2 },
      { label: "3Y", years: 3 },
      { label: "5Y", years: 5 },
      { label: "7Y", years: 7 },
      { label: "10Y", years: 10 },
      { label: "20Y", years: 20 },
      { label: "30Y", years: 30 },
    ];
    return maturities.map((point) => {
      const fitted =
        Number(factors.level) +
        Number(factors.slope) * nsLoadingSlope(point.years, Number(factors.lambda)) +
        Number(factors.curvature) * nsLoadingCurvature(point.years, Number(factors.lambda));
      return { ...point, fitted };
    });
  }

  function renderFittedCurve(curveStateSummary) {
    const points = fittedCurvePoints(curveStateSummary);
    if (!points.length) {
      return `
        <div class="curve-empty-state">
          <div class="terminal-label">Fitted curve</div>
          <div class="terminal-signal-text">Curve state not available.</div>
        </div>
      `;
    }

    const width = 640;
    const height = 240;
    const padding = { top: 16, right: 18, bottom: 30, left: 34 };
    const minYield = Math.min(...points.map((point) => point.fitted));
    const maxYield = Math.max(...points.map((point) => point.fitted));
    const range = Math.max(maxYield - minYield, 0.2);
    const xScale = (index) => padding.left + (index / (points.length - 1)) * (width - padding.left - padding.right);
    const yScale = (value) =>
      height - padding.bottom - ((value - (minYield - range * 0.1)) / (range * 1.2)) * (height - padding.top - padding.bottom);

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(index).toFixed(1)} ${yScale(point.fitted).toFixed(1)}`)
      .join(" ");

    const areaPath = `${linePath} L ${xScale(points.length - 1).toFixed(1)} ${(height - padding.bottom).toFixed(1)} L ${xScale(0).toFixed(1)} ${(height - padding.bottom).toFixed(1)} Z`;
    const yTicks = [minYield, minYield + range / 2, maxYield];

    return `
      <div class="curve-figure-shell">
        <div class="curve-figure-header">
          <div>
            <div class="terminal-label">Fitted nominal curve</div>
            <div class="curve-figure-title">Nelson-Siegel curve snapshot</div>
          </div>
          <div class="curve-factor-strip">
            <span>λ ${num(curveStateSummary.factors.lambda, 3)}</span>
            <span>L ${num(curveStateSummary.factors.level, 2)}</span>
            <span>S ${num(curveStateSummary.factors.slope, 2)}</span>
            <span>C ${num(curveStateSummary.factors.curvature, 2)}</span>
          </div>
        </div>
        <svg class="curve-figure" viewBox="0 0 ${width} ${height}" role="img" aria-label="Fitted Treasury yield curve">
          ${yTicks
            .map((tick) => {
              const y = yScale(tick).toFixed(1);
              return `
                <line class="curve-grid-line" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line>
                <text class="curve-grid-label" x="${padding.left - 8}" y="${y}">${num(tick, 2)}%</text>
              `;
            })
            .join("")}
          <path class="curve-area" d="${areaPath}"></path>
          <path class="curve-line" d="${linePath}"></path>
          ${points
            .map((point, index) => {
              const x = xScale(index).toFixed(1);
              const y = yScale(point.fitted).toFixed(1);
              return `
                <circle class="curve-point" cx="${x}" cy="${y}" r="4.2"></circle>
                <text class="curve-point-label" x="${x}" y="${height - 10}">${point.label}</text>
              `;
            })
            .join("")}
        </svg>
      </div>
    `;
  }

  function buildTooltip() {
    let tooltip = document.querySelector(".dashboard-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "dashboard-tooltip";
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  async function fetchData(source) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to load dashboard data from ${source}`);
    }
    return response.json();
  }

  function renderHomeSummary(container, payload) {
    const summary = payload.homepage_summary;
    const primarySnapshot = payload.snapshots?.[payload.tabs?.[0]?.date] || null;
    const topShock = primarySnapshot?.tabs?.shock?.ranked_shocks?.[0] || null;
    const posterior = primarySnapshot?.tabs?.posterior || null;
    const topForecasts = summary.forecast_groups
      .map((group) => {
        const topBranch = group.branches[0];
        return `
          <div class="mini-summary-row">
            <span class="mini-summary-label">${group.label}</span>
            <span class="mini-summary-value">${titleCase(topBranch.branch)} · ${pct(topBranch.probability)}</span>
          </div>
        `;
      })
      .join("");

    const keyMoves = summary.key_moves
      .map(
        (move) => `
          <div class="mini-move ${noteClass(move.tone)}">
            <span>${move.title}</span>
            <strong>${move.value}</strong>
          </div>
        `
      )
      .join("");

    container.innerHTML = `
      <div class="terminal-summary">
        <div class="terminal-summary-top">
          <div>
            <div class="terminal-label">Current snapshot</div>
            <div class="terminal-dominant">${titleCase(summary.dominant_regime)}</div>
            <div class="terminal-subline">${summary.date}</div>
          </div>
          <div class="terminal-metric-box">
            <div class="terminal-label">Top shock</div>
            <div class="terminal-metric-value">${summary.top_shock}</div>
          </div>
        </div>
        <div class="terminal-metrics-grid compact">
          <div class="terminal-metric-box">
            <div class="terminal-label">Entropy</div>
            <div class="terminal-metric-value">${num(summary.entropy, 2)}</div>
          </div>
          <div class="terminal-metric-box">
            <div class="terminal-label">Dominance gap</div>
            <div class="terminal-metric-value">${num(summary.dominance_gap, 2)}</div>
          </div>
        </div>
        <div class="terminal-signal-box">
          <div class="terminal-label">Covariance signal</div>
          <div class="terminal-signal-text">${summary.covariance_signal}</div>
        </div>
        ${renderFittedCurve(summary.curve_state_summary)}
        <div class="home-brief-grid">
          <div class="brief-card">
            <div class="terminal-label">Shock Today</div>
            <div class="brief-card-title">${topShock ? topShock.title : summary.top_shock}</div>
            <div class="brief-card-copy">${topShock ? topShock.narrative : "Latest ranked shock from the post-close update."}</div>
          </div>
          <div class="brief-card">
            <div class="terminal-label">Main Response</div>
            <div class="brief-card-title">${titleCase(summary.dominant_regime)}</div>
            <div class="brief-card-copy">${posterior ? posterior.summary_note : summary.covariance_signal}</div>
          </div>
        </div>
        <div class="terminal-moves-grid">${keyMoves}</div>
        <div class="terminal-forecast-block scenario-outlook">
          <div class="terminal-label">Expected Scenario Path</div>
          <div class="brief-card-copy">Top branch for tomorrow, +1 week, and +1 month from the current post-close state.</div>
          ${topForecasts}
        </div>
      </div>
    `;
  }

  function renderResearchDashboard(container, payload) {
    const tooltip = buildTooltip();
    const state = {
      activeView: payload.tabs[0].key,
      activeDetailTab: "prior",
      activeNodeId: null,
    };

    function getActiveView() {
      return payload.views[state.activeView];
    }

    function getNodeRegistry(view) {
      const registry = {};
      registry[view.tree.current.id] = { node: view.tree.current, snapshotKey: view.tree.current.detail_snapshot || view.current_snapshot, nodeType: "current" };
      view.tree.past.forEach((entry) => {
        registry[entry.dominant.id] = { node: entry.dominant, snapshotKey: entry.dominant.detail_snapshot || view.current_snapshot, nodeType: "past" };
        if (entry.contested) {
          registry[entry.contested.id] = { node: entry.contested, snapshotKey: entry.contested.detail_snapshot || view.current_snapshot, nodeType: "past-contested" };
        }
      });
      view.tree.forecast_groups.forEach((group) => {
        group.nodes.forEach((node) => {
          registry[node.id] = { node, snapshotKey: view.current_snapshot, nodeType: "forecast", forecastGroup: group.label };
        });
      });
      return registry;
    }

    function detailContext(view, registry) {
      const fallbackId = view.tree.current.id;
      const activeId = state.activeNodeId || fallbackId;
      const active = registry[activeId] || registry[fallbackId];
      const snapshot = payload.snapshots[active.snapshotKey];
      return { active, snapshot };
    }

    function renderPriorTab(prior) {
      return `
        <div class="detail-grid">
          <div class="detail-panel">
            <div class="detail-panel-title">Prior scenario probabilities</div>
            ${renderProbabilityBars(prior.probabilities)}
          </div>
          <div class="detail-panel">
            <div class="detail-panel-title">Prior covariance summary</div>
            <p class="detail-copy">${prior.covariance_summary}</p>
            <p class="detail-copy subtle">${prior.narrative_note}</p>
          </div>
        </div>
      `;
    }

    function renderShockTab(shock) {
      return `
        <div class="detail-panel full">
          <div class="detail-panel-title">${shock.headline}</div>
          <div class="shock-rank-list">
            ${shock.ranked_shocks
              .map(
                (item) => `
                  <div class="shock-rank-row">
                    <div class="shock-rank-num">${item.rank}</div>
                    <div class="shock-rank-body">
                      <div class="shock-rank-title">${item.title}</div>
                      <div class="shock-rank-meta">Score ${num(item.score, 2)} · ${item.direction}</div>
                      <div class="shock-rank-note">${item.narrative}</div>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    function renderCovarianceTab(covariance) {
      return `
        <div class="detail-grid covariance-layout">
          <div class="detail-panel covariance-panel">
            <div class="detail-panel-title">Current correlation heatmap</div>
            ${renderHeatmap(covariance.heatmap)}
          </div>
          <div class="detail-panel">
            <div class="detail-panel-title">Key-pair diagnostics</div>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Current</th>
                  <th>Prior</th>
                  <th>Δ</th>
                  <th>Persistence</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                ${covariance.key_pairs
                  .map(
                    (pair) => `
                      <tr>
                        <td>${pair.pair}</td>
                        <td>${num(pair.current, 2)}</td>
                        <td>${num(pair.prior, 2)}</td>
                        <td class="${pair.delta > 0 ? "tone-up" : pair.delta < 0 ? "tone-down" : "tone-flat"}">${signed(pair.delta, 2)}</td>
                        <td>${pair.persistence}</td>
                        <td>${pair.note}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    function renderPosteriorTab(posterior) {
      return `
        <div class="detail-grid">
          <div class="detail-panel">
            <div class="detail-panel-title">Posterior scenario probabilities</div>
            ${renderProbabilityBars(posterior.probabilities)}
          </div>
          <div class="detail-panel">
            <div class="detail-panel-title">Posterior diagnostics</div>
            <div class="metric-stack">
              <div class="mini-summary-row"><span>Entropy</span><strong>${num(posterior.entropy, 2)}</strong></div>
              <div class="mini-summary-row"><span>Dominance gap</span><strong>${num(posterior.dominance_gap, 2)}</strong></div>
              <div class="mini-summary-row"><span>Story-model gap</span><strong>${num(posterior.story_model_gap_total, 2)}</strong></div>
            </div>
            <p class="detail-copy subtle">${posterior.summary_note}</p>
            <div class="story-gap-grid">
              ${posterior.story_model_gap
                .map(
                  (item) => `
                    <div class="story-gap-chip ${item.gap > 0 ? "tone-up" : item.gap < 0 ? "tone-down" : "tone-flat"}">
                      <span>${titleCase(item.scenario)}</span>
                      <strong>${signed(item.gap, 2)}</strong>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;
    }

    function renderForecastTab(forecast, active) {
      const highlighted = active.nodeType === "forecast" ? active.node.detail : null;
      return `
        <div class="detail-grid">
          <div class="detail-panel">
            <div class="detail-panel-title">Top forecast probabilities</div>
            ${forecast.groups
              .map(
                (group) => `
                  <div class="forecast-group-panel">
                    <div class="forecast-group-label">${group.label}</div>
                    ${group.branches
                      .map(
                        (branch) => `
                          <div class="mini-summary-row">
                            <span>${titleCase(branch.branch)}</span>
                            <strong>${pct(branch.probability)}</strong>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="detail-panel">
            <div class="detail-panel-title">Selected node</div>
            ${
              highlighted
                ? `
                  <div class="detail-copy"><strong>${titleCase(highlighted.forecast_branch)}</strong> · ${pct(highlighted.forecast_probability)}</div>
                  <p class="detail-copy">${highlighted.description}</p>
                  <p class="detail-copy subtle">${highlighted.leaf}</p>
                `
                : `<p class="detail-copy">Select a forecast node on the right side of the tree to lock its branch details here.</p>`
            }
          </div>
        </div>
      `;
    }

    function render() {
      const view = getActiveView();
      const registry = getNodeRegistry(view);
      if (!state.activeNodeId || !registry[state.activeNodeId]) {
        state.activeNodeId = view.tree.current.id;
      }
      const { active, snapshot } = detailContext(view, registry);
      const tabContent = {
        prior: renderPriorTab(snapshot.tabs.prior),
        shock: renderShockTab(snapshot.tabs.shock),
        covariance: renderCovarianceTab(snapshot.tabs.covariance),
        posterior: renderPosteriorTab(snapshot.tabs.posterior),
        forecast: renderForecastTab(snapshot.tabs.forecast, active),
      };

      container.innerHTML = `
        <div class="macro-dashboard-shell">
          <div class="macro-toolbar">
            <div>
              <div class="terminal-label">Macro scenario terminal</div>
              <div class="macro-toolbar-title">${snapshot.display_date} · ${titleCase(snapshot.dominant_regime)}</div>
            </div>
            <div class="macro-toolbar-note">${payload.notes.scope}</div>
          </div>
          <div class="top-date-tabs">
            ${payload.tabs
              .map(
                (tab) => `
                  <button class="top-date-tab ${tab.key === state.activeView ? "active" : ""}" data-view-key="${tab.key}">
                    <span>${tab.label}</span>
                    <small>${tab.display_date}</small>
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="macro-tree-stage">
            <div class="stage-column past-column">
              <div class="stage-column-label">Past path</div>
              ${view.tree.past
                .map(
                  (entry) => `
                    <div class="path-stack">
                      <div class="path-date">${entry.date}</div>
                      ${renderNode(entry.dominant, state.activeNodeId === entry.dominant.id ? "selected" : "")}
                      ${entry.contested ? renderNode(entry.contested, `${state.activeNodeId === entry.contested.id ? "selected" : ""} contested`) : ""}
                    </div>
                  `
                )
                .join("")}
            </div>
            <div class="stage-column current-column">
              <div class="stage-column-label">Current stage</div>
              <div class="current-node-wrap">
                ${renderNode(view.tree.current, `${state.activeNodeId === view.tree.current.id ? "selected current-emphasis" : "current-emphasis"}`)}
              </div>
            </div>
            <div class="stage-column future-column">
              <div class="stage-column-label">Forecast tree</div>
              <div class="forecast-columns">
                ${view.tree.forecast_groups
                  .map(
                    (group) => `
                      <div class="forecast-column">
                        <div class="forecast-column-label">${group.label}</div>
                        ${group.nodes.map((node) => renderNode(node, state.activeNodeId === node.id ? "selected" : "")).join("")}
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </div>
          <div class="detail-shell">
            <div class="detail-shell-header">
              <div>
                <div class="terminal-label">Selected node</div>
                <div class="macro-toolbar-title">${titleCase(active.node.scenario)}</div>
              </div>
              <div class="detail-meta-strip">
                <span>${snapshot.display_date}</span>
                <span>${titleCase(snapshot.move_classification)}</span>
                <span>${snapshot.covariance_signal}</span>
              </div>
            </div>
            <div class="detail-tabs">
              ${["prior", "shock", "covariance", "posterior", "forecast"]
                .map(
                  (tabKey) => `
                    <button class="detail-tab ${tabKey === state.activeDetailTab ? "active" : ""}" data-detail-tab="${tabKey}">
                      ${titleCase(tabKey)}
                    </button>
                  `
                )
                .join("")}
            </div>
            <div class="detail-content">${tabContent[state.activeDetailTab]}</div>
            <div class="detail-footnote">${payload.notes.coverage_gap}</div>
          </div>
        </div>
      `;

      container.querySelectorAll("[data-view-key]").forEach((button) => {
        button.addEventListener("click", () => {
          state.activeView = button.dataset.viewKey;
          state.activeNodeId = null;
          state.activeDetailTab = "prior";
          render();
        });
      });

      container.querySelectorAll("[data-detail-tab]").forEach((button) => {
        button.addEventListener("click", () => {
          state.activeDetailTab = button.dataset.detailTab;
          render();
        });
      });

      container.querySelectorAll("[data-node-id]").forEach((button) => {
        const record = registry[button.dataset.nodeId];
        button.addEventListener("click", () => {
          state.activeNodeId = button.dataset.nodeId;
          if (record.nodeType === "forecast") {
            state.activeDetailTab = "forecast";
          }
          render();
        });
        button.addEventListener("mouseenter", () => {
          const tip = record.node.tooltip || {};
          tooltip.innerHTML = `
            <div class="tooltip-title">${tip.title || titleCase(record.node.scenario)}</div>
            <div class="tooltip-subtitle">${tip.subtitle || ""}</div>
            <div class="tooltip-body">${tip.body || ""}</div>
          `;
          tooltip.classList.add("visible");
        });
        button.addEventListener("mousemove", (event) => {
          tooltip.style.left = `${event.pageX + 16}px`;
          tooltip.style.top = `${event.pageY + 16}px`;
        });
        button.addEventListener("mouseleave", () => {
          tooltip.classList.remove("visible");
        });
      });
    }

    render();
  }

  async function bootstrap() {
    const researchContainer = document.querySelector("#macro-dashboard");
    const homeContainer = document.querySelector("#homepage-dashboard-summary");
    const anyContainer = researchContainer || homeContainer;
    if (!anyContainer) return;
    const source = anyContainer.dataset.dashboardSrc;
    const payload = await fetchData(source);

    if (researchContainer) {
      renderResearchDashboard(researchContainer, payload);
    }
    if (homeContainer) {
      renderHomeSummary(homeContainer, payload);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    bootstrap().catch((error) => {
      console.error(error);
      const targets = [document.querySelector("#macro-dashboard"), document.querySelector("#homepage-dashboard-summary")].filter(Boolean);
      targets.forEach((container) => {
        container.innerHTML = `<div class="dashboard-load-error">Dashboard failed to load: ${error.message}</div>`;
      });
    });
  });
})();
