// public/app.js
(() => {
  const socket = io({ transports: ['websocket'] });

  // DOM
  const botCountEl = document.getElementById('botCount');
  const pinCountEl = document.getElementById('pinCount');
  const botSelect = document.getElementById('botSelect');
  const viewer = document.getElementById('viewer');
  const spawnCount = document.getElementById('spawnCount');
  const spawnBtn = document.getElementById('spawnBtn');
  const spawnOneBtn = document.getElementById('spawnOneBtn');
  const killSelectedBtn = document.getElementById('killSelectedBtn');
  const killAllBtn = document.getElementById('killAllBtn');
  const terminal = document.getElementById('terminal');
  const customName = document.getElementById('customName');
  const filterSelected = document.getElementById('filterSelected');

  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatToPinned = document.getElementById('chatToPinned');

  const telemetryCards = {
    name: document.getElementById('tName'),
    pos: document.getElementById('tPos'),
    vitals: document.getElementById('tVitals'),
    dim: document.getElementById('tDim')
  };

  const viewerModeSel = document.getElementById('viewerMode');
  const gridWrap = document.getElementById('gridWrap');
  const singleWrap = document.getElementById('singleWrap');
  const gridCols = document.getElementById('gridCols');
  const gridColsVal = document.getElementById('gridColsVal');

  const pinSelectedBtn = document.getElementById('pinSelectedBtn');
  const unpinSelectedBtn = document.getElementById('unpinSelectedBtn');

  // State
  const bots = new Map(); // id -> { id, username, viewerUrl, status, telemetry? }
  let selectedId = null;
  const logs = []; // { ts, id, username, level, text }
  const MAX_LOGS = 800;
  const pinned = new Set(); // ids pinned to grid

  function statusDotClass(status) {
    if (status === 'online') return 'ok';
    if (status === 'reconnecting' || status === 'connecting') return 'warn';
    if (status === 'disconnected') return 'bad';
    return 'idle';
  }
  function optionLabel(info) {
    return `${info.username} — ${info.status}`;
  }

  function setGridCols(n) {
    document.documentElement.style.setProperty('--grid-cols', String(n));
    gridColsVal.textContent = String(n);
  }

  function refreshCounts() {
    botCountEl.textContent = `(${bots.size})`;
    pinCountEl.textContent = `Pinned: ${pinned.size}`;
  }

  function refreshSelect() {
    const prev = selectedId;
    botSelect.innerHTML = '';
    for (const info of bots.values()) {
      const opt = document.createElement('option');
      opt.value = info.id;
      opt.textContent = optionLabel(info);
      opt.dataset.status = info.status;
      botSelect.appendChild(opt);
    }
    if (prev && bots.has(prev)) {
      botSelect.value = prev;
    } else if (botSelect.options.length > 0) {
      botSelect.selectedIndex = 0;
    } else {
      botSelect.selectedIndex = -1;
    }
    onSelectionChange();
    refreshCounts();
  }

  function onSelectionChange() {
    selectedId = botSelect.value || null;
    const info = selectedId ? bots.get(selectedId) : null;
    if (viewerModeSel.value === 'single') {
      viewer.src = info?.viewerUrl || 'about:blank';
    }
    updateTelemetryPanel();
  }

  function fmt(n) {
    return (Math.round(n * 100) / 100).toFixed(2);
  }

  function hearts(health) {
    const total = 10;
    const filled = Math.max(0, Math.min(total, Math.round(health / 2)));
    return '❤'.repeat(filled) + '♡'.repeat(total - filled);
  }

  function updateTelemetryPanel() {
    const info = selectedId ? bots.get(selectedId) : null;
    telemetryCards.name.textContent = info?.username ?? '—';
    if (info?.telemetry) {
      const t = info.telemetry;
      telemetryCards.pos.textContent = `${fmt(t.x)}, ${fmt(t.y)}, ${fmt(t.z)}`;
      telemetryCards.vitals.textContent = `${hearts(t.health)} | 🍗 ${t.food}`;
      telemetryCards.dim.textContent = t.dimension;
    } else {
      telemetryCards.pos.textContent = '—';
      telemetryCards.vitals.textContent = '—';
      telemetryCards.dim.textContent = '—';
    }
  }

  function appendLog(entry, { render = true } = {}) {
    logs.push(entry);
    if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
    if (render) renderLogs([entry]);
  }

  function renderLogs(incremental = null) {
    const atBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 5;

    if (!incremental) terminal.innerHTML = '';

    const items = incremental || logs;
    const filterId = filterSelected.checked ? selectedId : null;

    for (const l of items) {
      if (filterId && l.id !== filterId) continue;
      const line = document.createElement('div');
      line.className = `log-line log-${l.level}`;
      const t = new Date(l.ts);
      const hh = String(t.getHours()).padStart(2, '0');
      const mm = String(t.getMinutes()).padStart(2, '0');
      const ss = String(t.getSeconds()).padStart(2, '0');
      const time = `[${hh}:${mm}:${ss}]`;
      line.innerHTML = `<span class="log-time">${time}</span> <span class="log-bot">${l.username}</span> ${l.text}`;
      terminal.appendChild(line);
    }

    if (atBottom) terminal.scrollTop = terminal.scrollHeight;
  }

  // Grid rendering
  function renderGrid() {
    gridWrap.innerHTML = '';
    for (const id of pinned) {
      const info = bots.get(id);
      if (!info) continue;
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.id = `tile-${id}`;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML = `
        <span class="name">${info.username}</span>
        <span class="dim">• <span id="meta-dim-${id}">${info.telemetry?.dimension ?? '—'}</span></span>
        <span class="health" id="meta-health-${id}">${info.telemetry ? hearts(info.telemetry.health) : ''}</span>
      `;

      const actions = document.createElement('div');
      actions.className = 'actions';
      const unpinBtn = document.createElement('button');
      unpinBtn.className = 'pill-btn';
      unpinBtn.textContent = 'Unpin';
      unpinBtn.addEventListener('click', () => {
        pinned.delete(id);
        renderGrid();
        refreshCounts();
      });
      actions.appendChild(unpinBtn);

      const iframe = document.createElement('iframe');
      iframe.className = 'viewer-iframe';
      iframe.title = `Viewer ${info.username}`;
      iframe.src = info.viewerUrl;

      tile.appendChild(meta);
      tile.appendChild(actions);
      tile.appendChild(iframe);
      gridWrap.appendChild(tile);
    }
  }

  function setViewerMode(mode) {
    if (mode === 'grid') {
      singleWrap.style.display = 'none';
      gridWrap.style.display = '';
      renderGrid();
    } else {
      singleWrap.style.display = '';
      gridWrap.style.display = 'none';
      // Load selected bot in single viewer
      const info = selectedId ? bots.get(selectedId) : null;
      viewer.src = info?.viewerUrl || 'about:blank';
    }
  }

  // Socket handlers
  socket.on('init', ({ bots: initialBots, logs: initialLogs }) => {
    bots.clear();
    for (const info of initialBots) bots.set(info.id, info);
    refreshSelect();

    terminal.innerHTML = '';
    for (const entry of initialLogs) appendLog(entry, { render: false });
    renderLogs();
  });

  socket.on('bot_added', (info) => {
    bots.set(info.id, info);
    refreshSelect();
    appendLog({ ts: Date.now(), id: info.id, username: info.username, level: 'info', text: 'Bot added' });
  });

  socket.on('bot_removed', ({ id }) => {
    const info = bots.get(id);
    const name = info?.username ?? id;
    bots.delete(id);
    // If pinned, unpin
    if (pinned.has(id)) pinned.delete(id);
    refreshSelect();
    renderGrid();
    appendLog({ ts: Date.now(), id, username: name, level: 'warn', text: 'Bot removed' });
  });

  socket.on('bot_status', ({ id, status }) => {
    const info = bots.get(id);
    if (info) {
      info.status = status;
      const opt = Array.from(botSelect.options).find(o => o.value === id);
      if (opt) opt.textContent = optionLabel(info);
    }
  });

  socket.on('telemetry', (payload) => {
    const info = bots.get(payload.id);
    if (!info) return;
    info.telemetry = payload;
    if (payload.id === selectedId) updateTelemetryPanel();

    // Update grid tile overlay if present
    const dimEl = document.getElementById(`meta-dim-${payload.id}`);
    if (dimEl) dimEl.textContent = payload.dimension;
    const healthEl = document.getElementById(`meta-health-${payload.id}`);
    if (healthEl) healthEl.textContent = hearts(payload.health);
  });

  socket.on('log', (entry) => {
    appendLog(entry);
  });

  // UI actions
  botSelect.addEventListener('change', onSelectionChange);

  spawnBtn.addEventListener('click', () => {
    const count = Math.max(1, Number(spawnCount.value) || 1);
    socket.emit('spawnMany', { count }, (ack) => {
      if (!ack?.ok) alert(`Spawn failed: ${ack?.error || 'unknown error'}`);
    });
  });

  spawnOneBtn.addEventListener('click', () => {
    const username = (customName.value || '').trim() || undefined;
    socket.emit('spawnBot', { username }, (ack) => {
      if (!ack?.ok) alert(`Spawn failed: ${ack?.error || 'unknown error'}`);
      else customName.value = '';
    });
  });

  killSelectedBtn.addEventListener('click', () => {
    const id = botSelect.value;
    if (!id) return;
    socket.emit('killBot', { id }, (ack) => {
      if (!ack?.ok) alert(`Kill failed: ${ack?.error || 'unknown error'}`);
    });
  });

  killAllBtn.addEventListener('click', () => {
    if (!confirm('Kill all bots?')) return;
    socket.emit('killAll', null, (ack) => {
      if (!ack?.ok) alert(`Kill all failed: ${ack?.error || 'unknown error'}`);
    });
  });

  // Pin / Unpin
  pinSelectedBtn.addEventListener('click', () => {
    const id = botSelect.value;
    if (!id) return;
    pinned.add(id);
    refreshCounts();
    if (viewerModeSel.value === 'grid') renderGrid();
  });

  unpinSelectedBtn.addEventListener('click', () => {
    const id = botSelect.value;
    if (!id) return;
    pinned.delete(id);
    refreshCounts();
    if (viewerModeSel.value === 'grid') renderGrid();
  });

  // Viewer mode + grid columns
  viewerModeSel.addEventListener('change', () => setViewerMode(viewerModeSel.value));
  gridCols.addEventListener('input', () => setGridCols(Number(gridCols.value)));
  setGridCols(Number(gridCols.value));
  setViewerMode(viewerModeSel.value);

  // Chat
  function sendChat() {
    const text = (chatInput.value || '').trim();
    if (!text) return;
    const targets = [];
    if (chatToPinned.checked) {
      for (const id of pinned) targets.push(id);
      if (targets.length === 0 && selectedId) targets.push(selectedId); // fallback
    } else if (selectedId) {
      targets.push(selectedId);
    }

    if (targets.length === 0) {
      alert('No bot selected or pinned.');
      return;
    }

    for (const id of targets) {
      socket.emit('chat', { id, text }, (ack) => {
        if (!ack?.ok) {
          appendLog({ ts: Date.now(), id, username: bots.get(id)?.username || id, level: 'error', text: `Chat failed: ${ack?.error || 'unknown error'}` });
        }
      });
      // Echo to terminal
      appendLog({ ts: Date.now(), id, username: bots.get(id)?.username || id, level: 'info', text: `[YOU] ${text}` });
    }

    chatInput.value = '';
    chatInput.focus();
  }

  chatSendBtn.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendChat();
    }
  });

  // Movement controls - Handle dashboard movement buttons

  // Get references to movement control elements
  const moveX = document.getElementById('moveX');
  const moveY = document.getElementById('moveY');
  const moveZ = document.getElementById('moveZ');
  const moveBtn = document.getElementById('moveBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const stopBtn = document.getElementById('stopBtn');
  const sprintX = document.getElementById('sprintX');
  const sprintZ = document.getElementById('sprintZ');
  const sprintBtn = document.getElementById('sprintBtn');
  const navX = document.getElementById('navX');
  const navY = document.getElementById('navY');
  const navZ = document.getElementById('navZ');
  const navBtn = document.getElementById('navBtn');

  // Move bot to entered coordinates using pathfinding
  moveBtn.addEventListener('click', () => {
    const id = selectedId;
    if (!id) return alert('No bot selected');
    const x = parseFloat(moveX.value);
    const y = parseFloat(moveY.value);
    const z = parseFloat(moveZ.value);
    if (isNaN(x) || isNaN(y) || isNaN(z)) return alert('Invalid coordinates');
    socket.emit('moveBot', { id, x, y, z }, (ack) => {
      if (!ack?.ok) alert(`Move failed: ${ack?.error || 'unknown error'}`);
    });
  });

  // Make selected bot jump
  jumpBtn.addEventListener('click', () => {
    const id = selectedId;
    if (!id) return alert('No bot selected');
    socket.emit('jumpBot', { id }, (ack) => {
      if (!ack?.ok) alert(`Jump failed: ${ack?.error || 'unknown error'}`);
    });
  });

  // Stop all movement for selected bot
  stopBtn.addEventListener('click', () => {
    const id = selectedId;
    if (!id) return alert('No bot selected');
    socket.emit('stopBotMovement', { id }, (ack) => {
      if (!ack?.ok) alert(`Stop failed: ${ack?.error || 'unknown error'}`);
    });
  });

  // Sprint bot to coordinates (faster but uses hunger)
  sprintBtn.addEventListener('click', () => {
    const id = selectedId;
    if (!id) return alert('No bot selected');
    const x = parseFloat(sprintX.value);
    const z = parseFloat(sprintZ.value);
    if (isNaN(x) || isNaN(z)) return alert('Invalid coordinates');
    socket.emit('sprintBot', { id, x, z }, (ack) => {
      if (!ack?.ok) alert(`Sprint failed: ${ack?.error || 'unknown error'}`);
    });
  });

  // Advanced navigation with obstacle avoidance
  navBtn.addEventListener('click', () => {
    const id = selectedId;
    if (!id) return alert('No bot selected');
    const x = parseFloat(navX.value);
    const y = parseFloat(navY.value);
    const z = parseFloat(navZ.value);
    if (isNaN(x) || isNaN(y) || isNaN(z)) return alert('Invalid coordinates');
    socket.emit('navigateBot', { id, x, y, z }, (ack) => {
      if (!ack?.ok) alert(`Navigate failed: ${ack?.error || 'unknown error'}`);
    });
  });
})();
