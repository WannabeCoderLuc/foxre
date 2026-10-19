/* FoxRe Interactive Web Portal Application Controller */

const state = {
  activeTab: 'dashboard',
  db: window.FOXRE_WIKI || { stats: {}, articles: [], commands: [], gameObjectTypes: [], crackedClasses: [], extractedEntityClasses: [] },
  activeMindMap: 'boot',
  tableSearch: '',
  selectedCommand: null
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initHexGrid();
  initStats();
  initCharts();
  initMindMap();
  initTables();
  initCalculators();
  setupNavigation();
});

// --- NAVIGATION ---
function setupNavigation() {
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.nav-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-view').forEach(v => {
    v.classList.toggle('active', v.id === `view-${tabId}`);
  });

  if (tabId === 'mindmap') {
    renderMindMap(state.activeMindMap);
  }
}

// --- STATS BAR ---
function initStats() {
  const stats = state.db.stats || {};
  document.getElementById('stat-cracked-classes').textContent = stats.crackedClasses || '792';
  document.getElementById('stat-entity-classes').textContent = stats.extractedEntityClasses || '1,137';
  document.getElementById('stat-commands').textContent = stats.commands || '514';
  document.getElementById('stat-articles').textContent = stats.articles || '218';
}

// --- HEXAGONAL TILES GRID ---
const HEX_TILES = [
  { id: 'arch-lifecycle', title: 'Engine Startup Chain', badge: 'Core', variant: 'cyan', icon: '⚡', desc: 'WinMain -> Kernel -> 12 Packages -> Master Frame Loop (0x140001cb0).' },
  { id: 'arch-quark', title: 'QuarkSystemTable', badge: '25 Managers', variant: 'amber', icon: '🎛️', desc: 'Static 33-slot pointer array at 0x142c6c0c0 hosting 25 active manager singletons.' },
  { id: 'arch-abi', title: 'ClassDescriptor ABI', badge: '10 Slots', variant: 'crimson', icon: '🧬', desc: 'Standardized 10-slot virtual table enabling CreateInstance, SetupSystem & QI.' },
  { id: 'arch-gameobject', title: 'GameObjectManager', badge: '16-Bit IDs', variant: 'emerald', icon: '🕹️', desc: 'Bitfield packing (typeIndex << 9 | instanceIndex) & 82 registered actor types.' },
  { id: 'commands-view', title: 'SendCommand Pipeline', badge: '514 Cmds', variant: 'purple', icon: '📡', desc: 'Lua dispatch -> 32-bit CityHash -> manager->vtable[16] (+0x80) jump tables.' },
  { id: 'fox2-reflection', title: '.fox2 Entity Reflection', badge: 'Binary Spec', variant: 'cyan', icon: '📐', desc: 'DataSetFile2Header, 64-byte EntityDef, 32-byte PropertyDef & 24 FoxDataTypes.' },
  { id: 'fox2-locator-bridge', title: 'Actor Spawning Bridge', badge: 'Coordinates', variant: 'amber', icon: '📍', desc: 'TransformData -> TransformEntity -> GameObjectLocator runtime actor placement.' },
  { id: 'ai-topology', title: 'Modular Actor AI', badge: '15 Parts', variant: 'crimson', icon: '🧠', desc: 'Standardized component stack: Realizer, Life, Notice, Damage, Action, AI.' },
  { id: 'actor-sahelan', title: 'Sahelanthropus Boss', badge: '2,651 Funcs', variant: 'purple', icon: '🤖', desc: '39 AI node tables, 6 decision states, 7 weapon action plugins, BVH damage masks.' },
  { id: 'navmesh-view', title: 'Navmesh .nav2 Engine', badge: '853 Meshes', variant: 'emerald', icon: '🗺️', desc: 'Polygon navigation meshes, crowd avoidance & 3D spatial path planner.' },
  { id: 'lua-view', title: 'Native FoxLua C API', badge: '264 Binders', variant: 'cyan', icon: '📜', desc: 'C-closure registration, SetLuaFunctions & SavedVarsManager persistence.' },
  { id: 'rosetta-stone', title: 'The Rosetta Stone', badge: 'Mystery Solved', variant: 'amber', icon: '💎', desc: 'Side-by-side reconciliation of community unknowns with decompiled binary proof.' }
];

function initHexGrid() {
  const container = document.getElementById('hex-honeycomb');
  if (!container) return;
  container.innerHTML = '';

  HEX_TILES.forEach(tile => {
    const el = document.createElement('div');
    el.className = `hex-tile ${tile.variant}`;
    el.onclick = () => handleHexClick(tile.id);
    el.innerHTML = `
      <div class="hex-content">
        <div class="hex-icon">${tile.icon}</div>
        <div class="hex-badge">${tile.badge}</div>
        <div class="hex-title">${tile.title}</div>
        <div class="hex-desc">${tile.desc}</div>
      </div>
    `;
    container.appendChild(el);
  });
}

function handleHexClick(tileId) {
  if (tileId === 'commands-view') {
    switchTab('tables');
    document.getElementById('table-select').value = 'commands';
    renderActiveTable('commands');
    return;
  }
  
  // Find article in db
  const article = state.db.articles.find(a => a.id === tileId);
  if (article) {
    openArticleModal(article);
  } else {
    switchTab('articles');
  }
}

// --- ARTICLE MODAL ---
function openArticleModal(article) {
  const modal = document.getElementById('article-modal');
  document.getElementById('modal-title').textContent = article.title;
  document.getElementById('modal-category').textContent = article.category;
  
  let content = article.content || '';
  if (window.marked) {
    document.getElementById('modal-body').innerHTML = marked.parse(content);
  } else {
    document.getElementById('modal-body').innerHTML = `<pre>${content}</pre>`;
  }
  modal.classList.add('active');
}

function closeArticleModal() {
  document.getElementById('article-modal').classList.remove('active');
}

// --- CHARTS & GRAPHS ---
function initCharts() {
  renderCoverageChart();
  renderQuarkReadsChart();
}

function renderCoverageChart() {
  const canvas = document.getElementById('chart-coverage');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Donut Chart: 792 Cracked vs 699 Unresolved (Total 1,491)
  const total = 1491;
  const cracked = 792;
  const unres = total - cracked;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 70;
  
  // Cracked slice
  const angleCracked = (cracked / total) * 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + angleCracked);
  ctx.lineWidth = 22;
  ctx.strokeStyle = '#00d2ff';
  ctx.stroke();

  // Unresolved slice
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2 + angleCracked, -Math.PI / 2 + 2 * Math.PI);
  ctx.lineWidth = 22;
  ctx.strokeStyle = '#1e293b';
  ctx.stroke();

  // Center text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${((cracked / total) * 100).toFixed(1)}%`, cx, cy - 6);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('CRACKED', cx, cy + 14);
}

function renderQuarkReadsChart() {
  const canvas = document.getElementById('chart-quark');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const data = [
    { name: 'MasterGameContext (+0x98)', reads: 6749, color: '#f59e0b' },
    { name: 'MessageBus (+0x60)', reads: 1108, color: '#00d2ff' },
    { name: 'TargetCollision (+0x80)', reads: 647, color: '#ef4444' },
    { name: 'LifeService (+0x28)', reads: 362, color: '#10b981' },
    { name: 'NoiseSystem (+0xA8)', reads: 348, color: '#a855f7' },
    { name: 'ComponentReg (+0x00)', reads: 288, color: '#38bdf8' },
    { name: 'HeapAllocator (+0x08)', reads: 272, color: '#6366f1' }
  ];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barHeight = 18;
  const startY = 20;
  const maxReads = 7000;
  const chartWidth = canvas.width - 180;

  data.forEach((item, i) => {
    const y = startY + i * 28;
    // Label
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.name, 10, y + 13);

    // Bar background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(160, y, chartWidth, barHeight);

    // Filled bar
    const fillWidth = (item.reads / maxReads) * chartWidth;
    ctx.fillStyle = item.color;
    ctx.fillRect(160, y, fillWidth, barHeight);

    // Value
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(item.reads.toLocaleString(), canvas.width - 10, y + 13);
  });
}

// --- INTERACTIVE MIND MAP ENGINE ---
const MIND_MAPS = {
  boot: {
    title: 'Engine Boot & Package Hierarchy',
    nodes: [
      { id: 'winmain', label: 'WinMain (0x140003AA0)', x: 120, y: 280, color: '#00d2ff' },
      { id: 'kernel', label: 'Engine Kernel (0x1400017C0)', x: 340, y: 280, color: '#3b82f6' },
      { id: 'quark', label: 'FoxQuark [9]\n(0x140BF1510)', x: 580, y: 120, color: '#f59e0b' },
      { id: 'qtable', label: 'QuarkSystemTable\n(0x142C6C0C0)', x: 800, y: 120, color: '#f59e0b' },
      { id: 'gamecore', label: 'GameCore [10]\n(0x140BF3620)', x: 580, y: 280, color: '#ef4444' },
      { id: 'gm', label: 'GameObjectManager\n(0x142C389A0)', x: 800, y: 280, color: '#ef4444' },
      { id: 'system', label: 'TppSystem [1]\n(0x14052E520)', x: 580, y: 440, color: '#10b981' },
      { id: 'loop', label: 'Master Frame Loop\n(0x140064560 / 0x140001CB0)', x: 1040, y: 280, color: '#a855f7' }
    ],
    edges: [
      { from: 'winmain', to: 'kernel' },
      { from: 'kernel', to: 'quark' },
      { from: 'quark', to: 'qtable' },
      { from: 'kernel', to: 'gamecore' },
      { from: 'gamecore', to: 'gm' },
      { from: 'kernel', to: 'system' },
      { from: 'qtable', to: 'loop' },
      { from: 'gm', to: 'loop' }
    ]
  },
  fox2: {
    title: '.fox2 Level Deserialization & Spawning Pipeline',
    nodes: [
      { id: 'fox2file', label: '.fox2 File (DataSetFile2Header)', x: 120, y: 280, color: '#00d2ff' },
      { id: 'dataset', label: 'DataSet (Root Container)', x: 360, y: 280, color: '#3b82f6' },
      { id: 'transformdata', label: 'TransformData (Parent)', x: 600, y: 180, color: '#f59e0b' },
      { id: 'transformentity', label: 'TransformEntity\n(Scale, Quat, Position)', x: 840, y: 180, color: '#f59e0b' },
      { id: 'locator', label: 'GameObjectLocator\n(typeName = StrCode64)', x: 600, y: 380, color: '#ef4444' },
      { id: 'classdesc', label: 'ClassDescriptor\n(Lookup 0x142C37F30)', x: 840, y: 380, color: '#10b981' },
      { id: 'create', label: 'vtable[1]: CreateInstance()\n(Heap Allocate + Ctor)', x: 1080, y: 280, color: '#a855f7' },
      { id: 'setup', label: 'vtable[4]: SetupSystem()\n(Wire Components & BVH)', x: 1080, y: 440, color: '#a855f7' }
    ],
    edges: [
      { from: 'fox2file', to: 'dataset' },
      { from: 'dataset', to: 'transformdata' },
      { from: 'transformdata', to: 'transformentity' },
      { from: 'dataset', to: 'locator' },
      { from: 'locator', to: 'classdesc' },
      { from: 'classdesc', to: 'create' },
      { from: 'create', to: 'setup' }
    ]
  },
  actor: {
    title: '15-Part Modular Actor-Component Topology',
    nodes: [
      { id: 'actor', label: 'Gameplay Actor\n(e.g. TppSoldier2 / TppBossQuiet2)', x: 600, y: 280, color: '#00d2ff' },
      { id: 'realizer', label: 'Realizer\n(Mesh Streaming)', x: 300, y: 100, color: '#3b82f6' },
      { id: 'life', label: 'LifeController\n(HP / Stamina)', x: 600, y: 80, color: '#ef4444' },
      { id: 'notice', label: 'NoticeController\n(Sight & Noise)', x: 900, y: 100, color: '#f59e0b' },
      { id: 'action', label: 'ActionController\n(Motion Queue)', x: 260, y: 280, color: '#10b981' },
      { id: 'damage', label: 'DamageHandler\n(Hitbox & Armor)', x: 940, y: 280, color: '#ef4444' },
      { id: 'sound', label: 'SoundController\n(Voice & Audio)', x: 300, y: 460, color: '#a855f7' },
      { id: 'ai', label: 'Per-Phase AI Nodes\n(Sneak, Caution, Combat, Dead)', x: 600, y: 480, color: '#f59e0b' },
      { id: 'flags', label: 'FlagInfo\n(State Bitmasks)', x: 900, y: 460, color: '#3b82f6' }
    ],
    edges: [
      { from: 'actor', to: 'realizer' },
      { from: 'actor', to: 'life' },
      { from: 'actor', to: 'notice' },
      { from: 'actor', to: 'action' },
      { from: 'actor', to: 'damage' },
      { from: 'actor', to: 'sound' },
      { from: 'actor', to: 'ai' },
      { from: 'actor', to: 'flags' }
    ]
  }
};

function initMindMap() {
  document.querySelectorAll('.mm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mm-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeMindMap = btn.dataset.map;
      renderMindMap(state.activeMindMap);
    });
  });
}

function renderMindMap(mapKey) {
  const canvas = document.getElementById('mindmap-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const map = MIND_MAPS[mapKey];
  if (!map) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Edges
  map.edges.forEach(edge => {
    const from = map.nodes.find(n => n.id === edge.from);
    const to = map.nodes.find(n => n.id === edge.to);
    if (!from || !to) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Subtle animated particle circle
    ctx.beginPath();
    ctx.arc((from.x + to.x) / 2, (from.y + to.y) / 2, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#00d2ff';
    ctx.fill();
  });

  // Draw Nodes
  map.nodes.forEach(node => {
    const width = 160;
    const height = 48;
    const x = node.x - width / 2;
    const y = node.y - height / 2;

    // Node Box
    ctx.fillStyle = '#101726';
    ctx.strokeStyle = node.color || '#00d2ff';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();
    ctx.stroke();

    // Node Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = node.label.split('\n');
    if (lines.length === 1) {
      ctx.fillText(lines[0], node.x, node.y);
    } else {
      ctx.fillText(lines[0], node.x, node.y - 7);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(lines[1], node.x, node.y + 9);
    }
  });
}

// --- DATA TABLES ---
function initTables() {
  const selector = document.getElementById('table-select');
  const search = document.getElementById('table-search');

  if (selector) {
    selector.addEventListener('change', () => {
      renderActiveTable(selector.value);
    });
  }

  if (search) {
    search.addEventListener('input', (e) => {
      state.tableSearch = e.target.value.toLowerCase();
      renderActiveTable(selector ? selector.value : 'commands');
    });
  }

  renderActiveTable('commands');
}

function renderActiveTable(tableKey) {
  const container = document.getElementById('table-body');
  const thead = document.getElementById('table-head');
  if (!container || !thead) return;

  const q = state.tableSearch;

  if (tableKey === 'commands') {
    thead.innerHTML = `
      <tr>
        <th>Command Name</th>
        <th>32-Bit Fox Hash</th>
        <th>64-Bit StrCode</th>
        <th>C++ Handler VA</th>
        <th>Owner / Manager</th>
        <th>Sample Vanilla Lua Call</th>
      </tr>
    `;
    const filtered = (state.db.commands || []).filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.sc32.toLowerCase().includes(q) ||
      c.manager.toLowerCase().includes(q)
    ).slice(0, 100);

    container.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td><span class="badge-tag badge-cyan">${c.sc32}</span></td>
        <td><span class="badge-tag badge-amber">${c.sc64}</span></td>
        <td><span class="badge-tag badge-crimson">${c.handlerVa}</span></td>
        <td>${c.manager}</td>
        <td><code style="font-size:11px;">${escapeHtml(c.lua)}</code></td>
      </tr>
    `).join('');
  } else if (tableKey === 'classes') {
    thead.innerHTML = `
      <tr>
        <th>Class Name</th>
        <th>48-Bit StrCode64</th>
        <th>Component Role & Notes</th>
      </tr>
    `;
    const filtered = (state.db.crackedClasses || []).filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.hash.toLowerCase().includes(q) ||
      c.notes.toLowerCase().includes(q)
    ).slice(0, 100);

    container.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td><span class="badge-tag badge-cyan">${c.hash}</span></td>
        <td>${c.notes}</td>
      </tr>
    `).join('');
  } else if (tableKey === 'entities') {
    thead.innerHTML = `
      <tr>
        <th>Entity Class Name</th>
        <th>PE .edata Address</th>
        <th>48-Bit StrCode64</th>
      </tr>
    `;
    const filtered = (state.db.extractedEntityClasses || []).filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.strAddr.toLowerCase().includes(q)
    ).slice(0, 100);

    container.innerHTML = filtered.map(e => `
      <tr>
        <td><strong>${e.name}</strong></td>
        <td><span class="badge-tag badge-emerald">${e.strAddr}</span></td>
        <td><span class="badge-tag badge-cyan">${e.strCode64}</span></td>
      </tr>
    `).join('');
  } else if (tableKey === 'types') {
    thead.innerHTML = `
      <tr>
        <th>Type Index</th>
        <th>Base ID</th>
        <th>GameObject Type Name</th>
      </tr>
    `;
    const filtered = (state.db.gameObjectTypes || []).filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.idBase.toLowerCase().includes(q)
    );

    container.innerHTML = filtered.map(t => `
      <tr>
        <td><span class="badge-tag badge-amber">${t.index}</span></td>
        <td><span class="badge-tag badge-cyan">${t.idBase}</span></td>
        <td><strong>${t.name}</strong></td>
      </tr>
    `).join('');
  }
}

// --- CALCULATORS & INTERACTIVE TOOLS ---
function initCalculators() {
  // Populate Type Select
  const typeSel = document.getElementById('calc-type-select');
  if (typeSel && state.db.gameObjectTypes) {
    typeSel.innerHTML = state.db.gameObjectTypes.map(t => 
      `<option value="${t.index}">${t.name} (Type ${t.index})</option>`
    ).join('');
  }

  // Two-way calculation bindings
  const typeInput = document.getElementById('calc-type-select');
  const instInput = document.getElementById('calc-inst-input');
  const packedInput = document.getElementById('calc-packed-input');

  function updateFromParts() {
    const type = parseInt(typeInput.value) || 0;
    const inst = parseInt(instInput.value) || 0;
    const packed = (type << 9) | (inst & 0x1FF);
    packedInput.value = `0x${packed.toString(16).toUpperCase()} (${packed})`;
  }

  function updateFromPacked() {
    let raw = packedInput.value.trim();
    let val = 0;
    if (raw.startsWith('0x') || raw.startsWith('0X')) {
      val = parseInt(raw, 16);
    } else {
      val = parseInt(raw, 10);
    }
    if (!isNaN(val)) {
      const type = val >> 9;
      const inst = val & 0x1FF;
      typeInput.value = type;
      instInput.value = inst;
    }
  }

  if (typeInput) typeInput.addEventListener('change', updateFromParts);
  if (instInput) instInput.addEventListener('input', updateFromParts);
  if (packedInput) packedInput.addEventListener('input', updateFromPacked);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
