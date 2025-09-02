const mineflayer = require('mineflayer')
const loadingBar = require('./utils/loadingBar')
const mineView = require("prismarine-viewer").mineflayer
const WorldVersion = '1.21.1'


let botArgs = {
    host: 'localhost',
    port: '25565',
    version: WorldVersion
}

class MCBot {
    constructor(username) {
        this.username = username;
        this.host = botArgs["host"]
        this.port = botArgs["port"]
        this.version = botArgs["version"]

        this.initBot()
    }

    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port
        })

        this.initEvents()
    }

    initEvents() {
        this.bot.on('login', async () => {
            let botSocket = this.bot._client.socket
            console.log(`[${this.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`)
        })

        this.bot.on('end', async (reason) => {
            console.log(`[${this.username}] Disconnected: ${reason}`)

            if (reason == "disconnect.quitting") {
                return
            }
            
            loadingBar(10000, `Reconnecting in 10 seconds...`)
            setTimeout(() => this.initBot(), 10000)
        })

        this.bot.on('error', async (err) => {
            if (err.code === 'ECONNREFUSED') {
                console.log(`[${this.username}] Failed to connect to ${err.address}:${err.port}`)
            }
            else {
                console.log(`[${this.username}] Had an unhandled error: ${err}`)
            }
        })

        this.bot.on("spawn", () => {
            mineView(this.bot, { port: 3000, firstPerson: false })

            const path = [this.bot.entity.position.clone()]
            this.bot.on('move', () => {
                if (path[path.length - 1].distanceTo(this.bot.entity.position) > 1) {
                    path.push(this.bot.entity.position.clone())
                    this.bot.viewer.drawLine('path', path)
                }
            })
        })

        this.bot.on("entityHurt", async (entity) => {
            if (entity === this.bot.entity) {
                this.bot.chat("I'm Hurt!")
            }
        })

        this.bot.on("playerCollect", async (collector, collected) => {
            if (collector.username === this.bot.username) {
                this.bot.chat(`I picked up ${collected.displayName || "an item"}!`)
            }
        })
    }

    logOut() {
            this.bot.chat("Goodbye!")
            this.bot.quit()
    }

}

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
