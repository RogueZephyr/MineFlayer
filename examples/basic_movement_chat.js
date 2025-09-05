/**
 * Basic Example: Movement + Chat + Viewer Integration
 *
 * This example demonstrates how to combine multiple MineFlayer features:
 * - Bot movement using pathfinding
 * - Chat command responses
 * - Real-time viewer updates
 * - Basic inventory management
 *
 * Features shown:
 * - Chat commands for movement
 * - Pathfinding integration
 * - Viewer synchronization
 * - Error handling
 */

const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals

// Bot configuration
const bot = mineflayer.createBot({
  host: 'localhost', // Change to your server
  port: 25565,
  username: 'BotExample',
  version: '1.21.1'
})

// Load pathfinder plugin
bot.loadPlugin(pathfinder)

let defaultMove = null

bot.once('spawn', () => {
  console.log('Bot spawned!')

  // Initialize movement configuration
  defaultMove = new Movements(bot)
  bot.pathfinder.setMovements(defaultMove)

  // Set up chat commands
  setupChatCommands()

  // Start viewer if available
  setupViewer()

  bot.chat('Hello! I am ready. Try: "come", "follow me", "stop", or "inventory"')
})

// Chat command handling
function setupChatCommands() {
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const command = message.toLowerCase().trim()

    switch (command) {
      case 'come':
        handleComeCommand(username)
        break

      case 'follow me':
        handleFollowCommand(username)
        break

      case 'stop':
        handleStopCommand()
        break

      case 'inventory':
        handleInventoryCommand()
        break

      case 'jump':
        handleJumpCommand()
        break

      case 'status':
        handleStatusCommand()
        break

      default:
        // Check for coordinate commands like "goto 100 64 200"
        const gotoMatch = message.match(/^goto\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)$/)
        if (gotoMatch) {
          const [, x, y, z] = gotoMatch
          handleGotoCommand(parseInt(x), parseInt(y), parseInt(z))
        }
    }
  })
}

// Command handlers
function handleComeCommand(username) {
  const target = bot.players[username]?.entity
  if (!target) {
    bot.chat(`I don't see you, ${username}!`)
    return
  }

  const goal = new GoalNear(target.position.x, target.position.y, target.position.z, 1)
  bot.pathfinder.setGoal(goal)

  bot.chat(`Coming to you, ${username}!`)
}

function handleFollowCommand(username) {
  const target = bot.players[username]?.entity
  if (!target) {
    bot.chat(`I don't see you, ${username}!`)
    return
  }

  // Follow at a distance
  const goal = new GoalNear(target.position.x, target.position.y, target.position.z, 3)
  bot.pathfinder.setGoal(goal, true) // Dynamic goal that updates

  bot.chat(`Following you, ${username}!`)
}

function handleStopCommand() {
  bot.pathfinder.setGoal(null)
  bot.chat('Stopping movement!')
}

function handleInventoryCommand() {
  const items = bot.inventory.items()
  if (items.length === 0) {
    bot.chat('My inventory is empty!')
    return
  }

  let message = 'Inventory: '
  items.slice(0, 5).forEach(item => {
    message += `${item.name}(${item.count}) `
  })

  if (items.length > 5) {
    message += `... and ${items.length - 5} more items`
  }

  bot.chat(message)
}

function handleJumpCommand() {
  bot.setControlState('jump', true)
  setTimeout(() => {
    bot.setControlState('jump', false)
  }, 500)

  bot.chat('Jumping!')
}

function handleStatusCommand() {
  const pos = bot.entity.position
  const health = Math.round(bot.health / 2 * 10) / 10 // Convert to hearts
  const food = Math.round(bot.food / 2 * 10) / 10

  bot.chat(`Position: ${Math.round(pos.x)}, ${Math.round(pos.y)}, ${Math.round(pos.z)} | Health: ${health}♥ | Food: ${food}🍗`)
}

function handleGotoCommand(x, y, z) {
  const goal = new GoalNear(x, y, z, 1)
  bot.pathfinder.setGoal(goal)

  bot.chat(`Going to ${x}, ${y}, ${z}!`)
}

// Viewer setup (if prismarine-viewer is available)
function setupViewer() {
  try {
    const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
    mineflayerViewer(bot, { port: 3000, firstPerson: false })
    console.log('Viewer started on port 3000')
  } catch (err) {
    console.log('Viewer not available:', err.message)
  }
}

// Pathfinding event handlers
bot.on('goal_reached', (goal) => {
  console.log('Goal reached!')
  bot.chat('I reached my destination!')
})

bot.on('path_update', (results) => {
  if (results.status === 'noPath') {
    bot.chat('I cannot find a path to that location!')
  }
})

// Error handling
bot.on('error', (err) => {
  console.error('Bot error:', err)
})

bot.on('kicked', (reason) => {
  console.log('Bot was kicked:', reason)
})

bot.on('end', () => {
  console.log('Bot disconnected')
})

// Graceful shutdown
process.on('SIGINT', () => {
  bot.quit('Shutting down')
  process.exit(0)
})

module.exports = bot
