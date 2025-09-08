

class MiningUtility {
    constructor(bot, movementController) {
        this.bot = bot
        this.movement = movementController
        this.state = 'idle'
        this.targets = []
    }

    async startMining(){}


}

module.exports = MiningUtility