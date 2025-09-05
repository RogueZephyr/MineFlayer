// utils/botManager.js
const EventEmitter = require('events');
const MCBot = require('./botFactory');

class BotManager extends EventEmitter {
  constructor({ host, port, version, viewerBasePort = 3000 }) {
    super();
    this.host = host;
    this.port = port;
    this.version = version;
    this.viewerBasePort = viewerBasePort;

    this._bots = new Map();          // id -> MCBot
    this._nextNameCounter = 0;
    this._nextViewerPort = viewerBasePort;
    this._recentLogs = [];
    this._recentLogLimit = 500;
  }

  getBotsInfo() {
    return Array.from(this._bots.values()).map((b) => b.getInfo());
  }

  getRecentLogs() {
    return this._recentLogs.slice();
  }

  async spawnOne({ username } = {}) {
    const id = username || this._nextUsername();
    if (this._bots.has(id)) throw new Error(`Bot ${id} already exists`);

    const viewerPort = this._allocViewerPort();
    const bot = new MCBot({
      id,
      username: id,
      host: this.host,
      port: this.port,
      version: this.version,
      viewerPort
    });

    // Pipe events outward
    bot.events.on('status', (payload) => this.emit('bot_status', payload));
    bot.events.on('telemetry', (payload) => this.emit('telemetry', payload));
    bot.events.on('log', (entry) => {
      this._pushLog(entry);
      this.emit('log', entry);
    });

    this._bots.set(id, bot);
    this.emit('bot_added', bot.getInfo());
    return bot.getInfo();
  }

  async killBot(id) {
    const bot = this._bots.get(id);
    if (!bot) throw new Error(`No such bot: ${id}`);
    bot.logOut();
    this._bots.delete(id);
    this.emit('bot_removed', { id });
  }

  async killAll() {
    const ids = Array.from(this._bots.keys());
    for (const id of ids) await this.killBot(id);
  }

  async chatToBot(id, text) {
    const bot = this._bots.get(id);
    if (!bot) throw new Error(`No such bot: ${id}`);
    await bot.sendChat(text);
  }

  async moveBot(id, x, y, z) {
    const bot = this._bots.get(id);
    if (!bot) throw new Error(`No such bot: ${id}`);
    await bot.walkToPosition(x, y, z);
  }

  async jumpBot(id) {
    const bot = this._bots.get(id);
    if (!bot) throw new Error(`No such bot: ${id}`);
    await bot.jump();
  }

  async sprintBot(id, x, z) {
    const bot = this._bots.get(id);
    if (!bot) throw new Error(`No such bot: ${id}`);
    await bot.sprintTo(x, z);
  }

  async navigateBot(id, x, y, z) {
    const bot = this._bots.get(id);
    if (!bot) throw new Error(`No such bot: ${id}`);
    await bot.navigateTo(x, y, z);
  }

  stopBotMovement(id) {
    const bot = this._bots.get(id);
    if (!bot) throw new Error(`No such bot: ${id}`);
    bot.stopMovement();
  }

  _nextUsername() {
    let name;
    do {
      name = `BOT_${this._nextNameCounter++}`;
    } while (this._bots.has(name));
    return name;
  }

  _allocViewerPort() {
    return this._nextViewerPort++;
  }

  _pushLog(entry) {
    this._recentLogs.push(entry);
    const overflow = this._recentLogs.length - this._recentLogLimit;
    if (overflow > 0) this._recentLogs.splice(0, overflow);
  }
}

module.exports = BotManager;
