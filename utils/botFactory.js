// utils/botFactory.js
const EventEmitter = require('events');
const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const MovementController = require('../systems/movementController');

class MCBot {
  constructor(opts) {
    this.id = opts.id || opts.username;
    this.username = opts.username;
    this.host = opts.host;
    this.port = opts.port;
    this.version = opts.version;
    this.viewerPort = Number(opts.viewerPort);
    this.viewerUrl = `http://localhost:${this.viewerPort}/`;

    this._shuttingDown = false;
    this._reconnectDelayMs = 10_000;
    this._telemetryTimer = null;
    this.events = new EventEmitter(); // emits: log, status, telemetry

    this.status = 'connecting';
    this._emitStatus('connecting');
    this.initBot();
  }

  initBot() {
    this.bot = mineflayer.createBot({
      username: this.username,
      host: this.host,
      port: this.port,
      version: this.version
    });

    this.movement = new MovementController(this.bot);
    this._wireEvents();
  }

  _wireEvents() {
    const bot = this.bot;

    bot.once('login', () => {
      this._log('info', `Logged in to ${this.host}:${this.port}`);
      this._emitStatus('online');
    });

    bot.on('error', (err) => {
      const code = err?.code || 'ERR';
      this._log('warn', `Connection issue (${code}) ${err.address ? `${err.address}:${err.port}` : ''}`);
    });

    bot.once('spawn', () => {
      this._openViewer();
      this._startTelemetryLoop();

      // Simple path trace
      const path = [bot.entity.position.clone()];
      const onMove = () => {
        const last = path[path.length - 1];
        if (last.distanceTo(bot.entity.position) > 1) {
          path.push(bot.entity.position.clone());
          bot.viewer.drawLine('path', path);
        }
      };
      bot.on('move', onMove);
      bot.once('end', () => bot.removeListener('move', onMove));
    });

    bot.on('health', () => {
      // Push immediate telemetry on health/food change
      this._emitTelemetry();
    });

    // Relay in-game chat to logs
    bot.on('chat', (username, message) => {
      this._log('info', `[CHAT] <${username}> ${message}`);
    });

    bot.on('entityHurt', (entity) => {
      if (entity === bot.entity) bot.chat("I'm Hurt!");
    });

    bot.on('playerCollect', (collector, collected) => {
      if (collector.username === bot.username) {
        bot.chat(`I picked up ${collected.displayName || 'an item'}!`);
      }
    });

    bot.on('end', (reason) => {
      this._log('info', `Disconnected: ${reason}`);

      // Close viewer and stop telemetry for this connection
      try { bot.viewer?.close(); } catch (_) {}
      this._stopTelemetryLoop();

      if (this._shuttingDown || reason === 'disconnect.quitting') {
        this._emitStatus('disconnected');
        return;
      }

      this._emitStatus('reconnecting');
      this._log('info', `Reconnecting in ${this._reconnectDelayMs / 1000}s...`);
      setTimeout(() => this.initBot(), this._reconnectDelayMs);
    });
  }

  _openViewer() {
    try {
      mineflayerViewer(this.bot, { port: this.viewerPort, firstPerson: false });
      this._log('info', `Viewer at ${this.viewerUrl}`);
    } catch (err) {
      this._log('error', `Failed to start viewer on ${this.viewerPort}: ${err.message}`);
    }
  }

  _startTelemetryLoop() {
    if (this._telemetryTimer) clearInterval(this._telemetryTimer);
    // Emit immediately, then every 400ms
    this._emitTelemetry();
    this._telemetryTimer = setInterval(() => this._emitTelemetry(), 400);
  }

  _stopTelemetryLoop() {
    if (this._telemetryTimer) {
      clearInterval(this._telemetryTimer);
      this._telemetryTimer = null;
    }
  }

  _emitTelemetry() {
    const b = this.bot;
    if (!b || !b.entity) return;
    const pos = b.entity.position;
    const dim = b.game?.dimension || 'unknown';
    const payload = {
      id: this.id,
      username: this.username,
      x: pos?.x ?? 0,
      y: pos?.y ?? 0,
      z: pos?.z ?? 0,
      yaw: b.entity?.yaw ?? 0,
      pitch: b.entity?.pitch ?? 0,
      health: b.health ?? 0,
      food: b.food ?? 0,
      dimension: dim
    };
    this.events.emit('telemetry', payload);
  }

  _emitStatus(status) {
    this.status = status;
    this.events.emit('status', { id: this.id, status });
  }

  _log(level, text) {
    const entry = { ts: Date.now(), id: this.id, username: this.username, level, text };
    this.events.emit('log', entry);
  }

  getInfo() {
    return {
      id: this.id,
      username: this.username,
      viewerPort: this.viewerPort,
      viewerUrl: this.viewerUrl,
      status: this.status
    };
  }

  async sendChat(text) {
    try {
      this.bot.chat(text);
      this._log('info', `[YOU] ${text}`);
    } catch (e) {
      this._log('error', `Failed to send chat: ${e.message}`);
      throw e;
    }
  }

  logOut() {
    this._shuttingDown = true;
    try { this.bot.chat('Goodbye!'); } catch (_) {}
    try { this.bot.viewer?.close(); } catch (_) {}
    try { this.bot.quit(); } catch (_) {}
  }

  // Movement methods - delegate to MovementController

  // Move bot to specific coordinates using pathfinding
  async walkToPosition(x, y, z) {
    return this.movement.walkToPosition(x, y, z);
  }

  // Make bot jump (handles ground check and timing)
  async jump() {
    return this.movement.jump();
  }

  // Sprint to coordinates (faster movement, uses more hunger)
  async sprintTo(x, z) {
    return this.movement.sprintTo(x, z);
  }

  // Advanced navigation with obstacle avoidance
  async navigateTo(x, y, z) {
    return this.movement.navigateTo(x, y, z);
  }

  // Stop all movement immediately
  stopMovement() {
    this.movement.stop();
  }
}

module.exports = MCBot;
