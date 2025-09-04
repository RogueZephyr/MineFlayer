// server.js
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const BotManager = require('./utils/botManager');

const APP_PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Configure your default Minecraft connection/version here
const manager = new BotManager({
  host: 'bot_testing.aternos.me',
  port: 63707,
  version: '1.21.1',
  viewerBasePort: 3000
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
});

server.listen(APP_PORT, () => {
  console.log(`[UI] Dashboard running at http://localhost:${APP_PORT}`);
});