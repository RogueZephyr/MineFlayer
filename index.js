const MCBot = require('./utils/botFactory');
const readline = require('readline');

const DEFAULTS = {
  host: 'localhost',
  port: 25565,
  version: '1.21.1'
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const bots = [];

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

(async () => {
  try {
    const answer = await ask('How many bots do you want to spawn? ');
    const botCount = Number.parseInt(answer, 10);
    if (!Number.isInteger(botCount) || botCount <= 0) {
      console.error('Please enter a positive integer.');
      process.exit(1);
    }

    const viewerStartPort = 3000;
    for (let i = 0; i < botCount; i++) {
      const username = `BOT_${i}`;
      const viewerPort = viewerStartPort + i;
      const bot = new MCBot({
        username,
        host: DEFAULTS.host,
        port: DEFAULTS.port,
        version: DEFAULTS.version,
        viewerPort
      });
      bots.push(bot);
    }

    console.log(`Created ${botCount} bots. Type 'quit' to exit.`);

    setupCommandInterface();
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();

function setupCommandInterface() {
  rl.setPrompt('$> ');
  rl.prompt();

  rl.on('line', async (input) => {
    const cmd = input.trim().toLowerCase();
    if (cmd === 'quit' || cmd === 'exit') {
      console.log('Shutting down all bots...');
      try {
        await shutdownAllBots();
      } finally {
        rl.close();
        process.exit(0);
      }
    } else if (cmd === 'help') {
      console.log("Commands: 'quit' | 'help'");
      rl.prompt();
    } else {
      console.log(`Unknown command: ${input}`);
      rl.prompt();
    }
  });

  // Graceful Ctrl+C
  process.on('SIGINT', async () => {
    console.log('\nCaught SIGINT. Shutting down...');
    try {
      await shutdownAllBots();
    } finally {
      rl.close();
      process.exit(0);
    }
  });
}

function shutdownAllBots() {
  return new Promise((resolve) => {
    let remaining = bots.length;
    if (remaining === 0) return resolve();

    for (const wrapper of bots) {
      const bot = wrapper.bot;
      const onEnd = () => {
        bot?.removeListener('end', onEnd); // idempotent
        remaining--;
        if (remaining === 0) resolve();
      };
      bot.once('end', onEnd);
      wrapper.logOut(); // will call bot.quit() and close its viewer
    }
  });
}