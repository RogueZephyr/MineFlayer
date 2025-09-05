/**
 * Basic Example: Block Detection + Inventory Management + Automated Actions
 *
 * This example shows how to:
 * - Detect specific blocks in the world
 * - Automatically collect items
 * - Manage inventory efficiently
 * - Perform automated tasks based on block detection
 *
 * Features demonstrated:
 * - Block scanning and detection
 * - Automated item collection
 * - Inventory management
 * - Conditional actions based on surroundings
 */

const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear, GoalBlock } = require('mineflayer-pathfinder').goals

// Bot configuration
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'CollectorBot',
  version: '1.21.1'
})

bot.loadPlugin(pathfinder)

let movements = null
let isCollecting = false

bot.once('spawn', () => {
  console.log('Collector Bot spawned!')

  movements = new Movements(bot)
  movements.allowSprinting = false // Careful movement for collection
  bot.pathfinder.setMovements(movements)

  setupAutomatedTasks()
  setupChatCommands()

  bot.chat('Collector Bot ready! I will automatically collect nearby items and manage resources.')
})

// Automated task setup
function setupAutomatedTasks() {
  // Collect items every 30 seconds
  setInterval(() => {
    if (!isCollecting) {
      collectNearbyItems()
    }
  }, 30000)

  // Monitor inventory space
  setInterval(() => {
    manageInventory()
  }, 60000)

  // Look for valuable blocks
  setInterval(() => {
    scanForValuableBlocks()
  }, 45000)
}

// Chat commands
function setupChatCommands() {
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const command = message.toLowerCase().trim()

    switch (command) {
      case 'collect':
        collectNearbyItems()
        bot.chat('Collecting nearby items!')
        break

      case 'inventory':
        showInventoryStatus()
        break

      case 'scan':
        scanForValuableBlocks()
        bot.chat('Scanning for valuable blocks!')
        break

      case 'drop junk':
        dropJunkItems()
        break

      case 'stats':
        showCollectionStats()
        break
    }
  })
}

// Item collection system
function collectNearbyItems() {
  if (isCollecting) return

  const items = Object.values(bot.entities).filter(entity =>
    entity.type === 'object' &&
    entity.objectType === 'Item' &&
    bot.entity.position.distanceTo(entity.position) < 32
  )

  if (items.length === 0) return

  isCollecting = true
  let collected = 0

  const collectNext = () => {
    if (items.length === 0) {
      isCollecting = false
      if (collected > 0) {
        bot.chat(`Collected ${collected} items!`)
      }
      return
    }

    const item = items.shift()
    if (!item) {
      collectNext()
      return
    }

    const goal = new GoalNear(item.position.x, item.position.y, item.position.z, 1)
    bot.pathfinder.setGoal(goal)

    // Wait for goal to be reached, then continue
    const onGoalReached = () => {
      collected++
      bot.removeListener('goal_reached', onGoalReached)
      setTimeout(collectNext, 1000) // Brief pause between collections
    }

    bot.once('goal_reached', onGoalReached)
  }

  collectNext()
}

// Block scanning system
function scanForValuableBlocks() {
  const valuableBlocks = ['diamond_ore', 'gold_ore', 'iron_ore', 'coal_ore', 'emerald_ore']
  const foundBlocks = []

  // Scan in a 20x20x20 area around the bot
  for (let x = -10; x <= 10; x++) {
    for (let y = -10; y <= 10; y++) {
      for (let z = -10; z <= 10; z++) {
        const block = bot.blockAt(bot.entity.position.offset(x, y, z))
        if (block && valuableBlocks.includes(block.name)) {
          foundBlocks.push({
            position: block.position,
            type: block.name,
            distance: bot.entity.position.distanceTo(block.position)
          })
        }
      }
    }
  }

  if (foundBlocks.length > 0) {
    // Sort by distance
    foundBlocks.sort((a, b) => a.distance - b.distance)

    const nearest = foundBlocks[0]
    bot.chat(`Found ${nearest.type} at ${Math.round(nearest.position.x)}, ${Math.round(nearest.position.y)}, ${Math.round(nearest.position.z)} (${Math.round(nearest.distance)} blocks away)`)

    // Optionally move to the block
    if (nearest.distance > 3) {
      const goal = new GoalBlock(nearest.position.x, nearest.position.y, nearest.position.z)
      bot.pathfinder.setGoal(goal)
    }
  } else {
    bot.chat('No valuable blocks found in scan area.')
  }
}

// Inventory management
function manageInventory() {
  const items = bot.inventory.items()
  const emptySlots = 36 - items.length

  if (emptySlots < 5) {
    bot.chat(`Warning: Only ${emptySlots} inventory slots remaining!`)
  }

  // Auto-drop junk items if inventory is getting full
  if (emptySlots < 3) {
    dropJunkItems()
  }
}

function dropJunkItems() {
  const junkItems = ['cobblestone', 'dirt', 'gravel', 'sand']
  let dropped = 0

  bot.inventory.items().forEach(item => {
    if (junkItems.includes(item.name) && item.count > 16) {
      // Keep some, drop excess
      const toDrop = item.count - 16
      bot.toss(item.type, null, toDrop)
      dropped += toDrop
    }
  })

  if (dropped > 0) {
    bot.chat(`Dropped ${dropped} junk items to free up space.`)
  }
}

function showInventoryStatus() {
  const items = bot.inventory.items()
  const valuableItems = items.filter(item =>
    ['diamond', 'gold_ingot', 'iron_ingot', 'emerald'].includes(item.name)
  )

  let message = `Inventory: ${items.length}/36 slots used`

  if (valuableItems.length > 0) {
    message += ' | Valuables: '
    valuableItems.forEach(item => {
      message += `${item.name}(${item.count}) `
    })
  }

  bot.chat(message)
}

function showCollectionStats() {
  const items = bot.inventory.items()
  const totalItems = items.reduce((sum, item) => sum + item.count, 0)
  const uniqueItems = items.length

  bot.chat(`Collection Stats: ${totalItems} total items, ${uniqueItems} unique types`)

  // Show top 3 most common items
  const sortedItems = items.sort((a, b) => b.count - a.count).slice(0, 3)
  if (sortedItems.length > 0) {
    let topItems = 'Top items: '
    sortedItems.forEach(item => {
      topItems += `${item.name}(${item.count}) `
    })
    bot.chat(topItems)
  }
}

// Event handlers
bot.on('playerCollect', (collector, collected) => {
  if (collector === bot.entity) {
    console.log(`Collected item: ${collected.displayName || collected.name}`)
  }
})

bot.on('entitySpawn', (entity) => {
  if (entity.type === 'object' && entity.objectType === 'Item') {
    // New item spawned nearby
    const distance = bot.entity.position.distanceTo(entity.position)
    if (distance < 10) {
      console.log(`Item spawned nearby: ${entity.displayName || entity.name} (${Math.round(distance)} blocks)`)
    }
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
