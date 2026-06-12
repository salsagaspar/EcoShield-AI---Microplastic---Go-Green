/* ==========================================================================
   ECOSHIELD AI — DASHBOARD APP.JS
   Full client-side data visualization + ML inference engine
   ========================================================================== */

// ── Global State ──────────────────────────────────────────────────────────────
let summaries = {};
let modelsMetadata = {};
let activeTab = 'overview';
let activeCharts = {};
let predLogEntries = [];

// ── DOM Cache ─────────────────────────────────────────────────────────────────
const timeWidgetSpan    = document.getElementById('current-time');
const btnRefresh        = document.getElementById('btn-refresh-data');
const tabTitle          = document.getElementById('tab-title');
const tabSubtitle       = document.getElementById('tab-subtitle');
const navItems          = document.querySelectorAll('.nav-item');
const tabPanes          = document.querySelectorAll('.tab-pane');
const simulatorModelSelect = document.getElementById('simulator-model-select');
const simGroupMicro     = document.getElementById('sim-group-micro');
const simGroupWaste     = document.getElementById('sim-group-waste');
const simGroupGreen     = document.getElementById('sim-group-green');
const predDisplayTitle  = document.getElementById('display-title');
const predDisplaySubtitle = document.getElementById('display-subtitle');
const predNumber        = document.getElementById('pred-number');
const predUnit          = document.getElementById('pred-unit');
const gaugeFillArc      = document.getElementById('gauge-fill-arc');
const predLevelLabel    = document.getElementById('pred-level-label');
const predLevelDesc     = document.getElementById('pred-level-desc');
const predIndicatorBox  = document.getElementById('pred-indicator-box');
const featureImportanceBars = document.getElementById('feature-importance-bars');
const predLogEl         = document.getElementById('pred-log');
const activityFeedEl    = document.getElementById('activity-feed');

// ── Color System ──────────────────────────────────────────────────────────────
const C = {
    micro:     '#00e5ff',
    microA:    'rgba(0, 229, 255, 0.2)',
    waste:     '#ffab40',
    wasteA:    'rgba(255, 171, 64, 0.2)',
    green:     '#00e676',
    greenA:    'rgba(0, 230, 118, 0.2)',
    indigo:    '#6366f1',
    indigoA:   'rgba(99, 102, 241, 0.2)',
    purple:    '#ce93d8',
    purpleA:   'rgba(206, 147, 216, 0.2)',
    teal:      '#26c6da',
    amber:     '#ffca28',
    danger:    '#ff5252',
    palette:   ['#6366f1','#00e5ff','#00e676','#ffab40','#ffca28','#ff5252','#ce93d8','#26c6da','#f472b6'],
};

// Global Chart.js defaults
Chart.defaults.color = '#8899b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Outfit', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 14, 30, 0.92)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.titleFont = { size: 12, weight: '700', family: "'Outfit', sans-serif" };
Chart.defaults.plugins.tooltip.bodyFont = { size: 12, family: "'Outfit', sans-serif" };
Chart.defaults.plugins.tooltip.cornerRadius = 10;

/* ==========================================================================
   UTILITIES
   ========================================================================== */
function updateClock() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    timeWidgetSpan.textContent = `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

function fmt(num, dec = 0) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Number(num).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function destroyChart(id) {
    if (activeCharts[id]) { activeCharts[id].destroy(); delete activeCharts[id]; }
}

/* ==========================================================================
   DATA LOAD & INIT
   ========================================================================== */
async function loadData() {
    const fetchJSON = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    };
    try {
        summaries.micro  = await fetchJSON('data/microplastics_summary.json');
        summaries.waste  = await fetchJSON('data/waste_summary.json');
        summaries.green  = await fetchJSON('data/green_summary.json');
        modelsMetadata   = await fetchJSON('data/models_metadata.json');
        console.log('[EcoShield] Data loaded successfully.');
        populateKPIs();
        renderAllCharts();
        populateActivityFeed();
        setupSimulatorInputs();
        runSimulatorPrediction();
    } catch (err) {
        console.error('[EcoShield] Data load error:', err);
        alert('Failed to load dashboard data. Ensure the server is running: python -m http.server 8000');
    }
}

/* ==========================================================================
   KPI POPULATION
   ========================================================================== */
function populateKPIs() {
    const ov = summaries.micro.overview;
    document.getElementById('stat-micro-samples').textContent     = fmt(ov.total_micro_samples);
    document.getElementById('stat-avg-concentration').textContent = fmt(ov.avg_micro_concentration, 2);
    document.getElementById('stat-waste-cleaned').textContent     = fmt(ov.total_waste_ton);
    document.getElementById('stat-co2-offset').textContent        = fmt(ov.total_co2_saved_ton);
    document.getElementById('stat-green-budget').textContent      = '$' + fmt(ov.total_green_budget / 1e6, 1) + 'M';
    const psr = ov.policy_success_rate;
    document.getElementById('stat-policy-success').textContent    = fmt(psr, 1) + '%';
    // Animate policy progress bar
    const pBar = document.getElementById('policy-progress');
    if (pBar) { setTimeout(() => { pBar.style.width = psr.toFixed(1) + '%'; }, 200); }
}

/* ==========================================================================
   ACTIVITY FEED
   ========================================================================== */
function populateActivityFeed() {
    const ov = summaries.micro.overview;
    const events = [
        { type: 'micro', text: `<strong>${fmt(ov.total_micro_samples)}</strong> microplastic samples verified and indexed`, time: '2 min ago' },
        { type: 'waste', text: `New waste cleanup campaign logged — <strong>${fmt(ov.total_waste_ton)} tons</strong> total collected`, time: '5 min ago' },
        { type: 'green', text: `Policy impact model updated — success rate <strong>${fmt(ov.policy_success_rate, 1)}%</strong>`, time: '9 min ago' },
        { type: 'micro', text: `Correlation heatmap recomputed with <strong>7 physicochemical features</strong>`, time: '14 min ago' },
        { type: 'waste', text: `Volunteer efficiency curve refreshed across <strong>7 group size brackets</strong>`, time: '22 min ago' },
        { type: 'green', text: `SDG alignment radar updated — <strong>${Object.keys(summaries.green.sdg_counts).length} SDGs</strong> tracked`, time: '31 min ago' },
        { type: 'micro', text: `Ridge regression model coefficients exported to <strong>models_metadata.json</strong>`, time: '45 min ago' },
        { type: 'green', text: `Green budget totaling <strong>$${fmt(ov.total_green_budget / 1e6, 1)}M</strong> allocated across initiatives`, time: '1 hr ago' },
    ];
    activityFeedEl.innerHTML = '';
    events.forEach(ev => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-dot ${ev.type}"></div>
            <div style="flex:1;">
                <div class="activity-text">${ev.text}</div>
                <div class="activity-time">${ev.time}</div>
            </div>`;
        activityFeedEl.appendChild(item);
    });
}

/* ==========================================================================
   TAB NAVIGATION
   ========================================================================== */
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        const tab = item.getAttribute('data-tab');
        activeTab = tab;
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `${tab}-tab`) pane.classList.add('active');
        });
        updateTabTitles(tab);
    });
});

function updateTabTitles(tab) {
    const titles = {
        overview: ['Environmental Intelligence Overview', 'Dynamic monitoring & predictive modeling dashboard'],
        pillar1:  ['Pillar 1: Microplastic Risk Analysis', 'Aquatic concentration maps & physicochemical factors'],
        pillar2:  ['Pillar 2: Waste Cleanup Intelligence', 'Campaign efficiency, volunteer impacts, and sources'],
        pillar3:  ['Pillar 3: Green Initiatives', 'Project budgets, carbon offset efficiency, and policy outcomes'],
        simulator:['EcoShield AI Prediction Playground', 'Interactive real-time model inference — change inputs to simulate'],
    };
    const t = titles[tab] || ['Dashboard', ''];
    tabTitle.textContent    = t[0];
    tabSubtitle.textContent = t[1];
}

btnRefresh.addEventListener('click', () => {
    const icon = btnRefresh.querySelector('i');
    icon.classList.add('fa-spin');
    loadData().finally(() => setTimeout(() => icon.classList.remove('fa-spin'), 1000));
});

/* ==========================================================================
   CHART RENDERING — ALL PILLARS
   ========================================================================== */
function renderAllCharts() {
    renderOverviewCharts();
    renderMicroCharts();
    renderWasteCharts();
    renderGreenCharts();
}

// ── Overview Charts ───────────────────────────────────────────────────────────
function renderOverviewCharts() {
    const green = summaries.green;

    // SDG Radar
    destroyChart('chart-sdg-radar');
    const sdgKeys = Object.keys(green.sdg_counts);
    const sdgVals = Object.values(green.sdg_counts);
    activeCharts['chart-sdg-radar'] = new Chart(document.getElementById('chart-sdg-radar'), {
        type: 'radar',
        data: {
            labels: sdgKeys,
            datasets: [{
                label: 'Initiative Count',
                data: sdgVals,
                backgroundColor: 'rgba(0, 230, 118, 0.15)',
                borderColor: C.green,
                borderWidth: 2,
                pointBackgroundColor: C.green,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.06)' },
                    angleLines: { color: 'rgba(255,255,255,0.06)' },
                    ticks: { display: false },
                    pointLabels: { color: '#8899b8', font: { size: 11 } },
                    beginAtZero: true,
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // SDG Horizontal Bar
    destroyChart('chart-sdg-bar');
    const sortedSdg = sdgKeys.map((k, i) => ({ k, v: sdgVals[i] })).sort((a, b) => b.v - a.v);
    activeCharts['chart-sdg-bar'] = new Chart(document.getElementById('chart-sdg-bar'), {
        type: 'bar',
        data: {
            labels: sortedSdg.map(x => x.k),
            datasets: [{
                data: sortedSdg.map(x => x.v),
                backgroundColor: sortedSdg.map((_, i) => C.palette[i % C.palette.length] + '33'),
                borderColor: sortedSdg.map((_, i) => C.palette[i % C.palette.length]),
                borderWidth: 1.5,
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });
}

// ── Pillar 1: Microplastics ───────────────────────────────────────────────────
function renderMicroCharts() {
    const data = summaries.micro;

    // Biome Bar
    destroyChart('chart-micro-biome');
    const biomeKeys = Object.keys(data.by_biome).sort((a,b) => data.by_biome[b] - data.by_biome[a]);
    const biomeVals = biomeKeys.map(k => data.by_biome[k]);
    activeCharts['chart-micro-biome'] = new Chart(document.getElementById('chart-micro-biome'), {
        type: 'bar',
        data: {
            labels: biomeKeys,
            datasets: [{
                label: 'Particles / L',
                data: biomeVals,
                backgroundColor: C.microA,
                borderColor: C.micro,
                borderWidth: 2,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Plastic Type Polar
    destroyChart('chart-micro-type');
    const typeKeys = Object.keys(data.by_plastic);
    const typeVals = typeKeys.map(k => data.by_plastic[k]);
    activeCharts['chart-micro-type'] = new Chart(document.getElementById('chart-micro-type'), {
        type: 'polarArea',
        data: {
            labels: typeKeys,
            datasets: [{
                data: typeVals,
                backgroundColor: C.palette.slice(0, typeKeys.length).map(c => c + '33'),
                borderColor: C.palette.slice(0, typeKeys.length),
                borderWidth: 1.5,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    angleLines: { color: 'rgba(255,255,255,0.05)' },
                    pointLabels: { display: true, color: '#8899b8', font: { size: 10 } },
                    ticks: { display: false },
                }
            }
        }
    });

    // Location Type Radar (NEW)
    destroyChart('chart-micro-location');
    const locKeys = Object.keys(data.by_location);
    const locVals = locKeys.map(k => data.by_location[k]);
    activeCharts['chart-micro-location'] = new Chart(document.getElementById('chart-micro-location'), {
        type: 'radar',
        data: {
            labels: locKeys,
            datasets: [{
                label: 'Avg Particles/L',
                data: locVals,
                backgroundColor: 'rgba(0, 229, 255, 0.12)',
                borderColor: C.micro,
                borderWidth: 2,
                pointBackgroundColor: C.micro,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.06)' },
                    angleLines: { color: 'rgba(255,255,255,0.06)' },
                    ticks: { display: false, backdropColor: 'transparent' },
                    pointLabels: { color: '#8899b8', font: { size: 11 } },
                    beginAtZero: true,
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Season Bar
    destroyChart('chart-micro-season');
    const seasonKeys = Object.keys(data.by_season);
    const seasonVals = seasonKeys.map(k => data.by_season[k]);
    const seasonColors = { Spring: '#a3e635', Summer: '#fbbf24', Autumn: '#f97316', Winter: '#60a5fa' };
    activeCharts['chart-micro-season'] = new Chart(document.getElementById('chart-micro-season'), {
        type: 'bar',
        data: {
            labels: seasonKeys,
            datasets: [{
                label: 'Particles / L',
                data: seasonVals,
                backgroundColor: seasonKeys.map(k => (seasonColors[k] || '#6366f1') + '33'),
                borderColor: seasonKeys.map(k => seasonColors[k] || '#6366f1'),
                borderWidth: 2,
                borderRadius: 10,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Scatter Depth vs Concentration
    destroyChart('chart-micro-scatter');
    const scatterData = data.scatter.map(pt => ({ x: pt.depth_m, y: pt.concentration_particles_per_l }));
    activeCharts['chart-micro-scatter'] = new Chart(document.getElementById('chart-micro-scatter'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Sample Point',
                data: scatterData,
                backgroundColor: 'rgba(0, 229, 255, 0.4)',
                borderColor: C.micro,
                borderWidth: 0.5,
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Sampling Depth (m)' } },
                y: { title: { display: true, text: 'Concentration (particles/L)' }, beginAtZero: true }
            }
        }
    });

    // Correlation Heatmap
    buildHeatmap(data.correlation);
}

function buildHeatmap(corrData) {
    const container = document.getElementById('micro-heatmap');
    container.innerHTML = '';
    const n = corrData.columns.length;
    container.style.gridTemplateColumns = `110px repeat(${n}, 1fr)`;
    const prettyLabel = (s) => s
        .replace(/_pct/, ' %').replace(/_ntu/, ' NTU').replace(/_ppt/, ' PPT')
        .replace(/_mm/, ' mm').replace(/_m$/, ' m').replace(/_l$/, ' L')
        .replace(/_c$/, ' °C').replace(/_mg/, ' mg').replace(/_km2/, ' km²')
        .replace(/_km/, ' km').replace(/_per_l/, '/L').replace(/_/g, ' ');

    // Corner cell
    container.appendChild(Object.assign(document.createElement('div'), { className: 'heatmap-label' }));
    corrData.columns.forEach(col => {
        const h = document.createElement('div');
        h.className = 'heatmap-label heatmap-label-top';
        h.textContent = prettyLabel(col);
        container.appendChild(h);
    });
    corrData.columns.forEach((row, rIdx) => {
        const lbl = document.createElement('div');
        lbl.className = 'heatmap-label';
        lbl.textContent = prettyLabel(row);
        container.appendChild(lbl);
        corrData.matrix[rIdx].forEach((val) => {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.textContent = val.toFixed(2);
            cell.title = `${prettyLabel(row)} × ${prettyLabel(corrData.columns[corrData.matrix[rIdx].indexOf(val)])} = ${val.toFixed(3)}`;
            const alpha = Math.abs(val) * 0.8;
            cell.style.backgroundColor = val >= 0
                ? `rgba(0, 229, 255, ${alpha})`
                : `rgba(255, 82, 82, ${alpha})`;
            cell.style.color = Math.abs(val) > 0.35 ? '#fff' : 'var(--text-secondary)';
            container.appendChild(cell);
        });
    });
}

// ── Pillar 2: Waste Cleanup ───────────────────────────────────────────────────
function renderWasteCharts() {
    const data = summaries.waste;

    // Source Horizontal Bar
    destroyChart('chart-waste-source');
    const srcKeys = Object.keys(data.by_source).sort((a,b) => data.by_source[b] - data.by_source[a]);
    const srcVals = srcKeys.map(k => data.by_source[k]);
    activeCharts['chart-waste-source'] = new Chart(document.getElementById('chart-waste-source'), {
        type: 'bar',
        data: {
            labels: srcKeys,
            datasets: [{
                data: srcVals,
                backgroundColor: C.wasteA,
                borderColor: C.waste,
                borderWidth: 2,
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });

    // Grade Doughnut
    destroyChart('chart-waste-grade');
    const gradeKeys = Object.keys(data.by_grade);
    const gradeVals = gradeKeys.map(k => data.by_grade[k]);
    activeCharts['chart-waste-grade'] = new Chart(document.getElementById('chart-waste-grade'), {
        type: 'doughnut',
        data: {
            labels: gradeKeys,
            datasets: [{
                data: gradeVals,
                backgroundColor: C.palette.map(c => c + '44'),
                borderColor: C.palette,
                borderWidth: 1.5,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } } },
            cutout: '62%',
        }
    });

    // Weather Radar (NEW)
    destroyChart('chart-waste-weather');
    const weatherKeys = Object.keys(data.by_weather);
    const weatherVals = weatherKeys.map(k => data.by_weather[k]);
    activeCharts['chart-waste-weather'] = new Chart(document.getElementById('chart-waste-weather'), {
        type: 'radar',
        data: {
            labels: weatherKeys,
            datasets: [{
                label: 'Avg Tons Collected',
                data: weatherVals,
                backgroundColor: 'rgba(255, 171, 64, 0.15)',
                borderColor: C.waste,
                borderWidth: 2,
                pointBackgroundColor: C.waste,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.06)' },
                    angleLines: { color: 'rgba(255,255,255,0.06)' },
                    ticks: { display: false, backdropColor: 'transparent' },
                    pointLabels: { color: '#8899b8', font: { size: 11 } },
                    beginAtZero: true,
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Volunteer Efficiency Line
    destroyChart('chart-waste-volunteers');
    const volKeys = Object.keys(data.vol_efficiency);
    const volVals = Object.values(data.vol_efficiency);
    activeCharts['chart-waste-volunteers'] = new Chart(document.getElementById('chart-waste-volunteers'), {
        type: 'line',
        data: {
            labels: volKeys,
            datasets: [{
                label: 'Avg Yield (Tons)',
                data: volVals,
                backgroundColor: 'rgba(255, 171, 64, 0.12)',
                borderColor: C.waste,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: C.waste,
                pointRadius: 6,
                pointHoverRadius: 8,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
        }
    });

    // Scatter Cost vs Weight
    destroyChart('chart-waste-scatter');
    const scatterData = data.scatter.map(pt => ({ x: pt.cost_usd, y: pt.weight_collected_ton }));
    activeCharts['chart-waste-scatter'] = new Chart(document.getElementById('chart-waste-scatter'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Cleanup Event',
                data: scatterData,
                backgroundColor: 'rgba(255, 171, 64, 0.4)',
                borderColor: C.waste,
                borderWidth: 0.5,
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Operational Cost (USD)' }, type: 'linear' },
                y: { title: { display: true, text: 'Weight Collected (Tons)' }, beginAtZero: true }
            }
        }
    });
}

// ── Pillar 3: Green Initiatives ───────────────────────────────────────────────
function renderGreenCharts() {
    const data = summaries.green;

    // Geo Success Dual-axis Bar
    destroyChart('chart-green-geo');
    const geoKeys = Object.keys(data.geo_success);
    activeCharts['chart-green-geo'] = new Chart(document.getElementById('chart-green-geo'), {
        type: 'bar',
        data: {
            labels: geoKeys,
            datasets: [
                {
                    label: 'Success Rate (%)',
                    data: geoKeys.map(k => data.geo_success[k].success_rate * 100),
                    backgroundColor: C.greenA,
                    borderColor: C.green,
                    borderWidth: 2,
                    borderRadius: 6,
                    yAxisID: 'y',
                },
                {
                    label: 'Avg Budget ($K)',
                    data: geoKeys.map(k => data.geo_success[k].avg_budget / 1000),
                    backgroundColor: C.indigoA,
                    borderColor: C.indigo,
                    borderWidth: 2,
                    borderRadius: 6,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y:  { type: 'linear', position: 'left',  beginAtZero: true, title: { display: true, text: 'Success Rate (%)' } },
                y1: { type: 'linear', position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Avg Budget (USD $K)' } }
            }
        }
    });

    // Outcomes Doughnut
    destroyChart('chart-green-policy');
    const outcomeKeys = Object.keys(data.policy_outcomes);
    const outcomeVals = outcomeKeys.map(k => data.policy_outcomes[k]);
    activeCharts['chart-green-policy'] = new Chart(document.getElementById('chart-green-policy'), {
        type: 'doughnut',
        data: {
            labels: outcomeKeys,
            datasets: [{
                data: outcomeVals,
                backgroundColor: [C.danger + '44', C.amber + '44', C.indigo + '44', C.green + '44'],
                borderColor:     [C.danger, C.amber, C.indigo, C.green],
                borderWidth: 1.5,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } } },
            cutout: '62%',
        }
    });

    // SDG Coverage Horizontal Bar (NEW)
    destroyChart('chart-green-sdg');
    const sdgKeys = Object.keys(data.sdg_counts).sort((a, b) => data.sdg_counts[b] - data.sdg_counts[a]);
    const sdgVals = sdgKeys.map(k => data.sdg_counts[k]);
    activeCharts['chart-green-sdg'] = new Chart(document.getElementById('chart-green-sdg'), {
        type: 'bar',
        data: {
            labels: sdgKeys,
            datasets: [{
                label: 'Initiatives',
                data: sdgVals,
                backgroundColor: sdgKeys.map((_, i) => C.palette[i % C.palette.length] + '33'),
                borderColor: sdgKeys.map((_, i) => C.palette[i % C.palette.length]),
                borderWidth: 1.5,
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });

    // Initiative Budget vs Efficiency
    destroyChart('chart-green-initiatives');
    const initKeys = Object.keys(data.initiatives);
    activeCharts['chart-green-initiatives'] = new Chart(document.getElementById('chart-green-initiatives'), {
        type: 'bar',
        data: {
            labels: initKeys,
            datasets: [
                {
                    label: 'Avg Budget ($K)',
                    data: initKeys.map(k => data.initiatives[k].avg_budget / 1000),
                    backgroundColor: C.indigoA,
                    borderColor: C.indigo,
                    borderWidth: 2,
                    borderRadius: 6,
                },
                {
                    label: 'Avg Plastic Removed (T)',
                    data: initKeys.map(k => data.initiatives[k].avg_plastic_removed),
                    backgroundColor: C.microA,
                    borderColor: C.micro,
                    borderWidth: 2,
                    borderRadius: 6,
                },
                {
                    label: 'Avg CO₂ Saved (T)',
                    data: initKeys.map(k => data.initiatives[k].avg_co2_saved),
                    backgroundColor: C.greenA,
                    borderColor: C.green,
                    borderWidth: 2,
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } } }
        }
    });
}

/* ==========================================================================
   AI INFERENCE ENGINE
   ========================================================================== */
function setupSimulatorInputs() {
    const populateSelector = (formId, name, cats) => {
        const sel = document.querySelector(`.sim-group#${formId} select[name="${name}"]`);
        if (!sel) return;
        sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
    };

    const mc = modelsMetadata.micro.encoder;
    populateSelector('sim-group-micro', 'location_type', mc.location_type);
    populateSelector('sim-group-micro', 'plastic_type',  mc.plastic_type);
    populateSelector('sim-group-micro', 'season',         mc.season);

    const wc = modelsMetadata.waste.encoder;
    populateSelector('sim-group-waste', 'waste_source',      wc.waste_source);
    populateSelector('sim-group-waste', 'weather_condition', wc.weather_condition);
    populateSelector('sim-group-waste', 'region',             wc.region);

    const gc = modelsMetadata.green.encoder;
    populateSelector('sim-group-green', 'initiative_type',  gc.initiative_type);
    populateSelector('sim-group-green', 'org_type',          gc.org_type);
    populateSelector('sim-group-green', 'geographic_scope',  gc.geographic_scope);

    // Slider value display + live inference
    document.querySelectorAll('.slider-control').forEach(sl => {
        sl.addEventListener('input', (e) => {
            // Attempt to update the value label via ID convention
            const group = e.target.closest('.sim-group');
            if (group) {
                const gId = group.id.replace('sim-group-', '');
                // Map slider name to display span
                const nameMap = {
                    turbidity_ntu:          `val-micro-turbidity`,
                    ph_level:               `val-micro-ph`,
                    salinity_ppt:           `val-micro-salinity`,
                    depth_m:                `val-micro-depth`,
                    avg_temperature_c:      `val-micro-temp`,
                    pollution_index:        `val-micro-pollution`,
                    volume_collected_m3:    `val-waste-volume`,
                    num_volunteers:         `val-waste-volunteers`,
                    duration_hours:         `val-waste-duration`,
                    cost_usd:               `val-waste-cost`,
                    microplastic_fraction_pct: `val-waste-fraction`,
                    total_budget_usd:        `val-green-budget`,
                    beneficiaries_reached:   `val-green-beneficiaries`,
                    media_coverage_count:    `val-green-media`,
                    co2_equivalent_saved_ton:`val-green-co2`,
                };
                const spanId = nameMap[e.target.name];
                if (spanId) {
                    const span = document.getElementById(spanId);
                    if (span) {
                        const v = parseFloat(e.target.value);
                        const isMoney = ['cost_usd', 'total_budget_usd', 'beneficiaries_reached'].includes(e.target.name);
                        span.textContent = isMoney ? v.toLocaleString() : (e.target.step % 1 === 0 ? v.toFixed(0) : v.toFixed(1));
                    }
                }
            }
            runSimulatorPrediction();
        });
    });

    document.querySelectorAll('.sim-group select').forEach(s => s.addEventListener('change', runSimulatorPrediction));

    simulatorModelSelect.addEventListener('change', (e) => {
        const model = e.target.value;
        simGroupMicro.style.display = model === 'micro' ? 'block' : 'none';
        simGroupWaste.style.display = model === 'waste' ? 'block' : 'none';
        simGroupGreen.style.display = model === 'green' ? 'block' : 'none';
        runSimulatorPrediction();
    });
}

function runSimulatorPrediction() {
    const modelKey = simulatorModelSelect.value;
    const model = modelsMetadata[modelKey];
    if (!model) return;

    // Gather inputs
    const inputs = {};
    const groupEl = document.getElementById(`sim-group-${modelKey}`);
    groupEl.querySelectorAll('input, select').forEach(el => {
        inputs[el.name] = el.tagName === 'INPUT' ? parseFloat(el.value) : el.value;
    });

    // Build feature vector
    const fv = [];
    const featureContribs = [];

    model.num_cols.forEach(col => {
        let val = inputs[col];
        if (val === undefined || isNaN(val)) {
            fv.push(0);
            featureContribs.push({ name: col, contribution: 0 });
        } else {
            const scaled = (val - model.scaler[col].mean) / model.scaler[col].scale;
            fv.push(scaled);
            featureContribs.push({ name: col, contribution: scaled * (model.coef[fv.length - 1] || 0) });
        }
    });

    const catOffset = fv.length;
    model.cat_cols.forEach(col => {
        const sel = inputs[col];
        const cats = model.encoder[col];
        cats.forEach((cat, ci) => {
            const oh = (sel !== undefined && sel === cat) ? 1 : 0;
            fv.push(oh);
            if (oh === 1) {
                featureContribs.push({ name: `${col}=${cat}`, contribution: oh * (model.coef[catOffset + ci] || 0) });
            }
        });
    });

    // Compute score
    let score = model.intercept;
    fv.forEach((v, i) => { score += v * (model.coef[i] || 0); });

    // Transform & display
    let displayVal, unit, gaugeColor, gaugeMax;

    if (modelKey === 'micro') {
        let val = Math.max(Math.exp(score) - 1, 0);
        displayVal = val.toFixed(2);
        unit = 'particles / L';
        gaugeColor = C.micro;
        gaugeMax = 40;
        predDisplayTitle.textContent = 'Predicted Microplastic Count';
        predDisplaySubtitle.textContent = 'Ridge Regression → exp(score) − 1';
        setGaugeValue(Math.min(val / gaugeMax, 1), gaugeColor);
        updateIndicatorBox(val, 5, 15, 'LOW RISK', 'MODERATE RISK', 'SEVERE RISK');
        appendPredLog('micro', val.toFixed(2), 'particles/L');
    } else if (modelKey === 'waste') {
        let val = Math.max(Math.exp(score) - 1, 0);
        displayVal = val.toFixed(2);
        unit = 'Metric Tons';
        gaugeColor = C.waste;
        gaugeMax = 15;
        predDisplayTitle.textContent = 'Predicted Waste Yield';
        predDisplaySubtitle.textContent = 'Ridge Regression → exp(score) − 1';
        setGaugeValue(Math.min(val / gaugeMax, 1), gaugeColor);
        updateIndicatorBox(val, 3, 8, 'SMALL YIELD', 'MEDIUM YIELD', 'HIGH YIELD');
        appendPredLog('waste', val.toFixed(2), 'tons');
    } else {
        let prob = 1 / (1 + Math.exp(-score));
        displayVal = (prob * 100).toFixed(1);
        unit = '% Success Chance';
        gaugeColor = C.green;
        predDisplayTitle.textContent = 'Policy Outcome Success Probability';
        predDisplaySubtitle.textContent = 'Logistic Regression → sigmoid(score)';
        setGaugeValue(prob, gaugeColor);
        updateIndicatorBox(prob * 100, 40, 60, 'UNLIKELY', 'POSSIBLE', 'HIGHLY PROBABLE');
        appendPredLog('green', (prob * 100).toFixed(1), '%');
    }

    predNumber.textContent = displayVal;
    predUnit.textContent   = unit;

    // Feature importance mini-bars
    renderFeatureImportance(featureContribs, gaugeColor || C.indigo);
}

function setGaugeValue(pct, color) {
    const deg = 90 + (pct * 180);
    gaugeFillArc.style.transform = `rotate(${deg}deg)`;
    gaugeFillArc.style.background = `conic-gradient(from 180deg, #0c1020 0deg, ${color} 180deg)`;
}

function updateIndicatorBox(val, lo, hi, lowTxt, midTxt, highTxt) {
    if (val < lo) {
        predLevelLabel.textContent = lowTxt;
        predLevelLabel.style.color = C.green;
        predIndicatorBox.style.borderColor = 'rgba(0, 230, 118, 0.25)';
    } else if (val < hi) {
        predLevelLabel.textContent = midTxt;
        predLevelLabel.style.color = C.amber;
        predIndicatorBox.style.borderColor = 'rgba(255, 202, 40, 0.25)';
    } else {
        predLevelLabel.textContent = highTxt;
        predLevelLabel.style.color = C.danger;
        predIndicatorBox.style.borderColor = 'rgba(255, 82, 82, 0.25)';
    }
}

function renderFeatureImportance(contribs, color) {
    // Sort by absolute contribution, take top 5 non-zero
    const ranked = contribs
        .filter(f => Math.abs(f.contribution) > 0.0001)
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
        .slice(0, 5);

    if (ranked.length === 0) { featureImportanceBars.innerHTML = '<p class="small text-secondary">No significant features found.</p>'; return; }

    const maxAbs = Math.max(...ranked.map(f => Math.abs(f.contribution)));
    featureImportanceBars.innerHTML = ranked.map(f => {
        const pct = (Math.abs(f.contribution) / maxAbs) * 100;
        const sign = f.contribution > 0 ? '+' : '−';
        const prettyName = f.name.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
        return `
        <div class="stat-bar-item">
            <div class="stat-bar-header">
                <span class="stat-bar-label">${prettyName}</span>
                <span class="stat-bar-val" style="color:${f.contribution > 0 ? color : C.danger};">${sign}${Math.abs(f.contribution).toFixed(3)}</span>
            </div>
            <div class="stat-bar-track">
                <div class="stat-bar-fill" style="width:${pct}%; background:${f.contribution > 0 ? color : C.danger};"></div>
            </div>
        </div>`;
    }).join('');
}

function appendPredLog(type, value, unit) {
    const now = new Date();
    const t = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const labels = { micro: 'Micro', waste: 'Waste', green: 'Policy' };

    predLogEntries.unshift({ type, value, unit, time: t, label: labels[type] });
    if (predLogEntries.length > 8) predLogEntries.pop();

    predLogEl.innerHTML = predLogEntries.map(entry => `
        <div class="pred-log-item">
            <span class="pred-log-tag ${entry.type}">${entry.label}</span>
            <span style="flex:1; font-size:0.78rem; color:var(--text-secondary);">${entry.value} ${entry.unit}</span>
            <span class="pred-log-time">${entry.time}</span>
        </div>
    `).join('');
}

/* ==========================================================================
   BOOTSTRAP
   ========================================================================== */
window.addEventListener('DOMContentLoaded', loadData);
