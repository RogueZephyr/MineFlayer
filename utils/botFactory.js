const mineflayer = require('mineflayer')
const loadingBar = require('./loadingBar')

let botArgs = {
    host: 'localhost',
    port: '25565',
    version: '1.21.1'
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

module.exports = MCBot