<div class="surface">
<p class="eyebrow">Decision, Risk and AI</p>
<h2>Daily U.S. macro scenario monitor with global energy and geopolitical transmission</h2>
<p>This page is rebuilt from public data and an explicit scenario model. It is designed to show how a desk economist could monitor a live macro shock, test whether market signals confirm the scenario, and keep the reasoning transparent instead of hiding it inside a black box.</p>
</div>

<div class="tone-strip">
<div class="process-card">
<p class="eyebrow">Current read</p>
<h3>De-escalation / relief</h3>
<p>Oil risk premium fades, volatility falls, credit tightens back in, and risk assets recover as markets price less near-term disruption.</p>
<p class="snapshot-meta">Generated: 2026-04-01 16:26 UTC</p>
<p class="snapshot-meta">Active event lens: Middle East energy and shipping disruption since 2026-03-10</p>
<p class='project-side-note'>Runner-up scenario: <strong>Growth drag / trade shock</strong> at 25.6%.</p>
</div>
<div class="process-card">
<p class="eyebrow">Five-question map</p>
<div class="metric-grid">
<div class='metric-card scenario-metric'><p class='metric-label'>demand</p><div class='metric-value'>mixed</div><p class='scenario-subvalue scenario-neutral'>-0.05</p></div><div class='metric-card scenario-metric'><p class='metric-label'>supply</p><div class='metric-value'>mixed</div><p class='scenario-subvalue scenario-neutral'>+0.01</p></div><div class='metric-card scenario-metric'><p class='metric-label'>inflation</p><div class='metric-value'>mixed</div><p class='scenario-subvalue scenario-neutral'>-0.25</p></div><div class='metric-card scenario-metric'><p class='metric-label'>financial conditions</p><div class='metric-value'>mixed</div><p class='scenario-subvalue scenario-neutral'>-0.15</p></div><div class='metric-card scenario-metric'><p class='metric-label'>fed</p><div class='metric-value'>more dovish / earlier easing</div><p class='scenario-subvalue scenario-negative'>-0.32</p></div>
</div>
</div>
</div>

<div class="surface">
<p class="eyebrow">Scenario score</p>
<h3>Probability scoreboard</h3>
<div class="scenario-bars">
<div class='scenario-bar-row'><div class='scenario-bar-label'>De-escalation / relief</div><div class='scenario-bar-track'><div class='scenario-bar-fill' style='width:58.3%'></div></div><div class='scenario-bar-value'>58.3%</div></div><div class='scenario-bar-row'><div class='scenario-bar-label'>Growth drag / trade shock</div><div class='scenario-bar-track'><div class='scenario-bar-fill' style='width:25.6%'></div></div><div class='scenario-bar-value'>25.6%</div></div><div class='scenario-bar-row'><div class='scenario-bar-label'>Geopolitical energy shock</div><div class='scenario-bar-track'><div class='scenario-bar-fill' style='width:8.1%'></div></div><div class='scenario-bar-value'>8.1%</div></div><div class='scenario-bar-row'><div class='scenario-bar-label'>Stagflation persistence</div><div class='scenario-bar-track'><div class='scenario-bar-fill' style='width:8.0%'></div></div><div class='scenario-bar-value'>8.0%</div></div>
</div>
</div>

<div class="chapter-grid">
<div class="chapter-card">
<p class="eyebrow">Evidence that confirms the dominant scenario</p>
<ul class="detail-list">
<li><strong>Brent crude</strong>: contribution +0.85</li><li><strong>VIX</strong>: contribution +0.65</li><li><strong>S&amp;P 500</strong>: contribution +0.59</li>
</ul>
</div>
<div class="chapter-card">
<p class="eyebrow">Signals pulling against it</p>
<ul class="detail-list">
<li><strong>Broad U.S. dollar</strong>: contribution -0.37</li>
</ul>
</div>
<div class="chapter-card">
<p class="eyebrow">Method</p>
<p class="hub-focus">Signals are standardized across 1d, 2d, 5d, and 20d horizons, then matched against scenario sign expectations using explicit weights.</p>
<p>No black-box classifier is used in this version. The system is designed for economic interpretation first and machine assistance second.</p>
</div>
</div>

<div class="surface">
<p class="eyebrow">Market signal dashboard</p>
<h3>Daily move, medium-horizon move, and current shock intensity</h3>
<div class="table-scroll">
<table class="dashboard-table">
<thead>
<tr>
<th>Signal</th>
<th>Latest</th>
<th>1d</th>
<th>5d</th>
<th>20d</th>
<th>Composite z</th>
<th>30-observation path</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Brent crude</strong><div class='table-note'>Energy</div></td><td>103.79 $/bbl</td><td>-12.35%</td><td>+2.72%</td><td>+44.35%</td><td>-2.52</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,37 7,36 12,37 18,37 23,37 28,38 34,36 39,35 45,35 50,36 55,36 61,37 66,36 71,36 77,32 82,28 88,29 93,24 98,19 104,20 109,23 114,23 120,15 125,14 131,16 136,11 141,4 147,9 152,4 158,14'/></svg></td></tr><tr><td><strong>Henry Hub gas</strong><div class='table-note'>Energy</div></td><td>2.94 $/MMBtu</td><td>-3.29%</td><td>-2.97%</td><td>-6.07%</td><td>-0.22</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,14 7,19 12,14 18,4 23,15 28,22 34,31 39,24 45,21 50,22 55,30 61,28 66,33 71,30 77,30 82,24 88,38 93,36 98,24 104,14 109,25 114,21 120,13 125,17 131,28 136,21 141,22 147,17 152,27 158,33'/></svg></td></tr><tr><td><strong>U.S. high yield spread</strong><div class='table-note'>Credit</div></td><td>3.28 pct</td><td>-18.00 bps</td><td>+9.00 bps</td><td>+20.00 bps</td><td>-1.38</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,36 7,38 12,32 18,31 23,33 28,31 34,24 39,23 45,28 50,25 55,31 61,30 66,22 71,19 77,26 82,24 88,20 93,14 98,14 104,17 109,18 114,14 120,16 125,19 131,19 136,20 141,18 147,6 152,4 158,14'/></svg></td></tr><tr><td><strong>10Y breakeven inflation</strong><div class='table-note'>Inflation</div></td><td>2.30 pct</td><td>-1.00 bps</td><td>-3.00 bps</td><td>+1.00 bps</td><td>-0.44</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,28 7,28 12,31 18,35 23,35 28,31 34,31 39,38 45,28 50,28 55,28 61,24 66,15 71,17 77,19 82,13 88,8 93,13 98,13 104,10 109,4 114,10 120,8 125,19 131,19 136,24 141,17 147,24 152,24 158,26'/></svg></td></tr><tr><td><strong>2Y Treasury yield</strong><div class='table-note'>Rates</div></td><td>3.82 pct</td><td>-6.00 bps</td><td>-1.00 bps</td><td>+35.00 bps</td><td>-1.03</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,35 7,32 12,32 18,32 23,35 28,35 34,33 39,35 45,38 50,32 55,30 61,28 66,26 71,27 77,27 82,26 88,22 93,15 98,17 104,20 109,20 114,15 120,13 125,8 131,11 136,7 141,11 147,4 152,8 158,12'/></svg></td></tr><tr><td><strong>10Y Treasury yield</strong><div class='table-note'>Rates</div></td><td>4.35 pct</td><td>-9.00 bps</td><td>+1.00 bps</td><td>+30.00 bps</td><td>-1.06</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,32 7,29 12,30 18,30 23,33 28,32 34,32 39,34 45,38 50,32 55,31 61,29 66,26 71,24 77,27 82,24 88,20 93,16 98,15 104,19 109,21 114,17 120,17 125,7 131,11 136,7 141,11 147,5 152,4 158,10'/></svg></td></tr><tr><td><strong>10Y real yield</strong><div class='table-note'>Rates</div></td><td>2.04 pct</td><td>-9.00 bps</td><td>+3.00 bps</td><td>+28.00 bps</td><td>-1.05</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,32 7,31 12,32 18,31 23,33 28,33 34,33 39,36 45,38 50,34 55,33 61,31 66,29 71,31 77,33 82,29 88,27 93,23 98,21 104,25 109,28 114,26 120,24 125,13 131,13 136,9 141,13 147,8 152,4 158,11'/></svg></td></tr><tr><td><strong>Broad U.S. dollar</strong><div class='table-note'>FX</div></td><td>120.89 index</td><td>+0.41%</td><td>+0.51%</td><td>+2.60%</td><td>+1.42</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,38 7,35 12,34 18,30 23,33 28,33 34,33 39,35 45,34 50,34 55,26 61,18 66,22 71,17 77,18 82,17 88,25 93,20 98,14 104,7 109,11 114,14 120,13 125,11 131,10 136,13 141,11 147,11 152,9 158,4'/></svg></td></tr><tr><td><strong>S&amp;P 500</strong><div class='table-note'>Equities</div></td><td>6,528.52 index</td><td>+2.91%</td><td>-0.42%</td><td>-4.23%</td><td>+1.47</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,7 7,8 12,6 18,10 23,7 28,4 34,6 39,7 45,7 50,11 55,8 61,10 66,15 71,12 77,13 82,13 88,19 93,21 98,17 104,16 109,22 114,23 120,28 125,24 131,25 136,23 141,30 147,36 152,38 158,27'/></svg></td></tr><tr><td><strong>VIX</strong><div class='table-note'>Volatility</div></td><td>25.25 index</td><td>-17.51%</td><td>-6.31%</td><td>+7.13%</td><td>-1.66</td><td><svg viewBox='0 0 160 42' class='sparkline' role='img' aria-label='Recent signal path'><polyline fill='none' stroke='#12495b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' points='2,33 7,32 12,34 18,30 23,33 28,38 34,36 39,32 45,28 50,23 55,29 61,22 66,8 71,18 77,19 82,21 88,13 93,14 98,23 104,26 109,19 114,22 120,15 125,16 131,14 136,18 141,13 147,4 152,5 158,19'/></svg></td></tr>
</tbody>
</table>
</div>
</div>

<div class="surface">
<p class="eyebrow">Lag check</p>
<h3>Does the active event still behave like the chosen scenario?</h3>
<div class="table-scroll">
<table class="dashboard-table lag-table">
<thead>
<tr>
<th>Signal</th>
<th>Expected</th>
<th>t+1</th>
<th>t+2</th>
<th>t+5</th>
<th>t+20</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Brent crude</strong></td><td>down</td><td class='lag-miss'>1.27</td><td class='lag-miss'>13.96</td><td class='lag-miss'>12.47</td><td class='lag-na'>n/a</td></tr><tr><td><strong>VIX</strong></td><td>down</td><td class='lag-match'>-2.81</td><td class='lag-miss'>9.47</td><td class='lag-match'>-5.70</td><td class='lag-miss'>22.78</td></tr><tr><td><strong>S&amp;P 500</strong></td><td>up</td><td class='lag-miss'>-0.08</td><td class='lag-miss'>-1.61</td><td class='lag-miss'>-1.21</td><td class='lag-miss'>-6.46</td></tr><tr><td><strong>U.S. high yield spread</strong></td><td>down</td><td class='lag-miss'>3.00</td><td class='lag-miss'>11.00</td><td class='lag-miss'>21.00</td><td class='lag-miss'>40.00</td></tr><tr><td><strong>Broad U.S. dollar</strong></td><td>down</td><td class='lag-miss'>0.47</td><td class='lag-miss'>0.92</td><td class='lag-miss'>1.16</td><td class='lag-na'>n/a</td></tr><tr><td><strong>2Y Treasury yield</strong></td><td>down</td><td class='lag-miss'>7.00</td><td class='lag-miss'>19.00</td><td class='lag-miss'>11.00</td><td class='lag-miss'>25.00</td></tr><tr><td><strong>10Y Treasury yield</strong></td><td>down</td><td class='lag-miss'>6.00</td><td class='lag-miss'>12.00</td><td class='lag-miss'>8.00</td><td class='lag-miss'>20.00</td></tr><tr><td><strong>10Y breakeven inflation</strong></td><td>down</td><td class='lag-miss'>3.00</td><td class='lag-miss'>5.00</td><td class='lag-miss'>3.00</td><td class='lag-match'>-2.00</td></tr>
</tbody>
</table>
</div>
</div>

<div class="surface">
<p class="eyebrow">Macro backdrop</p>
<h3>Slower-moving confirmation variables</h3>
<div class="table-scroll">
<table class="dashboard-table">
<thead>
<tr>
<th>Macro signal</th>
<th>Read</th>
<th>Method</th>
<th>Latest date</th>
</tr>
</thead>
<tbody>
<tr><td><strong>CPI inflation</strong><div class='table-note'>Inflation</div></td><td>+2.66%</td><td>y/y</td><td>2026-02-01</td></tr><tr><td><strong>PCE inflation</strong><div class='table-note'>Inflation</div></td><td>+2.83%</td><td>y/y</td><td>2026-01-01</td></tr><tr><td><strong>Unemployment rate</strong><div class='table-note'>Labor</div></td><td>4.40 pct</td><td>latest</td><td>2026-02-01</td></tr><tr><td><strong>Nonfarm payrolls</strong><div class='table-note'>Labor</div></td><td>-92k</td><td>m/m change</td><td>2026-02-01</td></tr><tr><td><strong>Retail sales</strong><div class='table-note'>Demand</div></td><td>+3.71%</td><td>y/y</td><td>2026-02-01</td></tr><tr><td><strong>Industrial production</strong><div class='table-note'>Supply</div></td><td>+1.44%</td><td>y/y</td><td>2026-02-01</td></tr>
</tbody>
</table>
</div>
</div>

<div class="surface">
<p class="eyebrow">Workflow</p>
<h3>How this system is built every day</h3>
<ol>
<li>Pull official public series for energy, rates, inflation compensation, credit, FX, equities, and key macro releases.</li>
<li>Compute 1d, 2d, 5d, and 20d moves and standardize them against trailing history.</li>
<li>Score a small set of explicit scenarios using expected sign and signal importance.</li>
<li>Use the active event date to test whether lagged market behavior still confirms the chosen shock narrative.</li>
<li>Publish a static snapshot that is reproducible, reviewable, and easy to explain to a recruiter, hiring manager, or research lead.</li>
</ol>
</div>
