const MCBot = require('./utils/botFactory')
const readline = require("readline");

const botConfig = {
    host: "localhost",
    port: "25565",
    username: "BOT"
};

let bots = []
let botNames = []

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function shutdownAllBots() {
    bots.forEach(bot => {
        bot.logOut()
    });
}

rl.question('How many bots do you want to spawn? ', (answer) =>{
    const botCount = parseInt(answer)
    for (var i = 0; i < botCount; i++) {
        bots.push(new MCBot(`BOT_${i}`))
        botNames.push(`BOT_${i}`)
    }
    console.log(`Created ${botCount} bots. Type 'quit' to exit.`);
    setTimeout(setupCommandInterface, 1000)
})

function setupCommandInterface() {
    rl.setPrompt('$> ');
    rl.prompt();
    
    rl.on('line', (input) => {
        if (input.trim() === 'quit') {
            console.log('Shutting down all bots...');
            shutdownAllBots();
            // Don't close readline immediately - wait for bots to disconnect
        } else {
            console.log(`Unknown command: ${input}`);
            rl.prompt();
        }
    });
}

function shutdownAllBots() {
    let botsDisconnected = 0;
    
    bots.forEach(bot => {
        bot.bot.on('end', () => {
            botsDisconnected++;
            if (botsDisconnected === bots.length) {
                console.log('All bots disconnected. Exiting program.');
                
            }
        });
        bot.logOut();
        rl.close();
        process.exit(0);
    });
}
