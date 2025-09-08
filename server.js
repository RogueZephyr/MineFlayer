// server.js
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const BotManager = require('./utils/botManager');
const configLoader = require('./utils/configLoader');

const config = configLoader.load();

const APP_PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : config.webDashboard.port;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Configure your default Minecraft connection/version here
const manager = new BotManager({
  host: config.server.host,
  port: config.server.port,
  version: config.server.version,
  viewerBasePort: config.webDashboard.viewerBasePort
});

// Pipe manager events to connected clients
manager.on('bot_added', (info) => io.emit('bot_added', info));
manager.on('bot_removed', (info) => io.emit('bot_removed', info));
manager.on('bot_status', (payload) => io.emit('bot_status', payload));
manager.on('telemetry', (payload) => io.emit('telemetry', payload));
manager.on('log', (entry) => io.emit('log', entry));

io.on('connection', (socket) => {
  // Initial snapshot
  socket.emit('init', {
    bots: manager.getBotsInfo(),
    logs: manager.getRecentLogs()
  });

  // Spawn one bot (optional username)
  socket.on('spawnBot', async ({ username } = {}, cb) => {
    try {
      const info = await manager.spawnOne({ username });
      cb?.({ ok: true, info });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Spawn many bots
  socket.on('spawnMany', async ({ count } = {}, cb) => {
    try {
      const infos = [];
      for (let i = 0; i < (Number(count) || 0); i++) {
        infos.push(await manager.spawnOne({}));
      }
      cb?.({ ok: true, infos });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Kill one bot by id
  socket.on('killBot', async ({ id } = {}, cb) => {
    try {
      await manager.killBot(id);
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Kill all bots
  socket.on('killAll', async (_, cb) => {
    try {
      await manager.killAll();
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Send chat to a specific bot
  socket.on('chat', async ({ id, text } = {}, cb) => {
    try {
      if (!id) throw new Error('No bot id provided');
      if (!text || !text.trim()) throw new Error('Empty message');
      await manager.chatToBot(id, text.trim());
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Movement commands - Handle dashboard movement controls

  // Move bot to specific coordinates with pathfinding
  socket.on('moveBot', async ({ id, x, y, z } = {}, cb) => {
    try {
      if (!id) throw new Error('No bot id provided');
      await manager.moveBot(id, x, y, z);
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Make selected bot jump
  socket.on('jumpBot', async ({ id } = {}, cb) => {
    try {
      if (!id) throw new Error('No bot id provided');
      await manager.jumpBot(id);
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Sprint bot to coordinates (faster but uses hunger)
  socket.on('sprintBot', async ({ id, x, z } = {}, cb) => {
    try {
      if (!id) throw new Error('No bot id provided');
      await manager.sprintBot(id, x, z);
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Advanced navigation with obstacle avoidance
  socket.on('navigateBot', async ({ id, x, y, z } = {}, cb) => {
    try {
      if (!id) throw new Error('No bot id provided');
      await manager.navigateBot(id, x, y, z);
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });

  // Stop all movement for selected bot
  socket.on('stopBotMovement', async ({ id } = {}, cb) => {
    try {
      if (!id) throw new Error('No bot id provided');
      manager.stopBotMovement(id);
      cb?.({ ok: true });
    } catch (e) {
      cb?.({ ok: false, error: e.message });
    }
  });
});

server.listen(APP_PORT, () => {
  console.log(`[UI] Dashboard running at http://localhost:${APP_PORT}`);
});
