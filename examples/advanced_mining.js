/**
 * Advanced Example: Automated Mining with Pathfinding and Inventory Management
 *
 * This example shows a sophisticated mining bot that can:
 * - Automatically mine valuable ores
 * - Return to a base location when inventory is full
 * - Avoid dangerous areas (lava, cliffs)
 * - Use advanced pathfinding for efficient routes
 * - Handle mining tools and tool durability
 * - Deposit mined items in chests
 *
 * Features demonstrated:
 * - Complex state machine for mining operations
 * - Advanced pathfinding with custom movement rules
 * - Inventory management and tool maintenance
 * - Risk assessment and safety protocols
 * - Automated chest interactions
 * - Mining pattern optimization
 */

const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear, GoalBlock, GoalCompositeAny } = require('mineflayer-pathfinder').goals

// Bot configuration
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'MiningBot',
  version: '1.21.1'
})

bot.loadPlugin(pathfinder)

// Mining configuration
const CONFIG = {
  VALUABLE_ORES: ['diamond_ore', 'gold_ore', 'iron_ore', 'coal_ore', 'emerald_ore', 'redstone_ore', 'lapis_ore'],
  DANGEROUS_BLOCKS: ['lava', 'fire', 'magma_block'],
  BASE_POSITION: { x: 0, y: 64, z: 0 }, // Home base coordinates
  MINING_RADIUS: 50,
  INVENTORY_THRESHOLD: 28, // Return when 28/36 slots used
  MIN_TOOL_DURABILITY: 100,
  CHEST_CHECK_INTERVAL: 30000 // Check for nearby chests every 30 seconds
}

// State management
let currentState = 'idle'
let movements = null
let miningTargets = []
let currentTarget = null
let returnToBase = false
let nearbyChests = []

bot.once('spawn', () => {
  console.log('Advanced Mining Bot spawned!')

  // Configure movements for mining
  movements = new Movements(bot)
  movements.canDig = true
  movements.allowParkour = false // Safer for mining
  movements.allowSprinting = false
  movements.maxDropDown = 1 // Prevent falling into caves
  movements.dontCreateFlow = true // Don't break blocks near water/lava
  movements.dontMineUnderFallingBlock = true

  // Custom movement rules for mining
  movements.exclusionAreasStep.push((block) => {
    if (CONFIG.DANGEROUS_BLOCKS.includes(block.name)) {
      return 100 // Make dangerous blocks impossible to step on
    }
    return 0
  })

  bot.pathfinder.setMovements(movements)

  setupEventHandlers()
  setupChatCommands()

  bot.chat('Advanced Mining Bot ready! I will automatically mine valuable ores and manage resources.')
  setState('scanning')
})

// State machine
function setState(newState) {
  console.log(`State change: ${currentState} -> ${newState}`)
  currentState = newState

  switch (newState) {
    case 'scanning':
      startScanning()
      break
    case 'mining':
      startMining()
      break
    case 'returning':
      returnToBaseLocation()
      break
    case 'depositing':
      depositItems()
      break
    case 'idle':
      // Wait for next action
      break
  }
}

// Scanning for mining targets
function startScanning() {
  console.log('Scanning for valuable ores...')

  miningTargets = []
  const botPos = bot.entity.position

  // Scan in expanding circles
  for (let radius = 5; radius <= CONFIG.MINING_RADIUS; radius += 5) {
    for (let angle = 0; angle < 360; angle += 30) {
      const radian = (angle * Math.PI) / 180
      const x = Math.round(botPos.x + radius * Math.cos(radian))
      const z = Math.round(botPos.z + radius * Math.sin(radian))

      // Scan vertically around this position
      for (let y = Math.max(1, botPos.y - 20); y <= Math.min(255, botPos.y + 20); y++) {
        const block = bot.blockAt(new Vec3(x, y, z))
        if (block && CONFIG.VALUABLE_ORES.includes(block.name)) {
          miningTargets.push({
            position: new Vec3(x, y, z),
            type: block.name,
            distance: botPos.distanceTo(new Vec3(x, y, z))
          })
        }
      }
    }

    // Limit targets to prevent overload
    if (miningTargets.length >= 10) break
  }

  // Sort by distance
  miningTargets.sort((a, b) => a.distance - b.distance)

  if (miningTargets.length > 0) {
    console.log(`Found ${miningTargets.length} mining targets`)
    setState('mining')
  } else {
    console.log('No valuable ores found in scan area')
    setTimeout(() => setState('scanning'), 30000) // Retry in 30 seconds
  }
}

// Mining operation
function startMining() {
  if (miningTargets.length === 0) {
    setState('scanning')
    return
  }

  currentTarget = miningTargets.shift()
  console.log(`Mining ${currentTarget.type} at ${currentTarget.position}`)

  const goal = new GoalBlock(currentTarget.position.x, currentTarget.position.y, currentTarget.position.z)
  bot.pathfinder.setGoal(goal)
}

// Return to base when inventory is full
function returnToBaseLocation() {
  console.log('Returning to base...')
  const goal = new GoalNear(CONFIG.BASE_POSITION.x, CONFIG.BASE_POSITION.y, CONFIG.BASE_POSITION.z, 2)
  bot.pathfinder.setGoal(goal)
}

// Deposit items in chests
function depositItems() {
  if (nearbyChests.length === 0) {
    console.log('No chests found for depositing')
    setState('scanning')
    return
  }

  // Find nearest chest
  const botPos = bot.entity.position
  nearbyChests.sort((a, b) => botPos.distanceTo(a.position) - botPos.distanceTo(b.position))
  const nearestChest = nearbyChests[0]

  const goal = new GoalNear(nearestChest.position.x, nearestChest.position.y, nearestChest.position.z, 2)
  bot.pathfinder.setGoal(goal)
}

// Event handlers
function setupEventHandlers() {
  // Pathfinding events
  bot.on('goal_reached', (goal) => {
    console.log('Goal reached')

    switch (currentState) {
      case 'mining':
        if (currentTarget) {
          mineBlock(currentTarget.position)
        }
        break
      case 'returning':
        setState('depositing')
        break
      case 'depositing':
        performDeposit()
        break
    }
  })

  bot.on('path_update', (results) => {
    if (results.status === 'noPath') {
      console.log('No path found, skipping target')
      if (currentState === 'mining') {
        setState('mining') // Try next target
      }
    }
  })

  // Mining events
  bot.on('diggingCompleted', (block) => {
    console.log(`Finished mining ${block.name}`)
    checkInventoryAndContinue()
  })

  bot.on('diggingAborted', (block) => {
    console.log(`Mining aborted for ${block.name}`)
    checkInventoryAndContinue()
  })

  // Health monitoring
  bot.on('health', () => {
    if (bot.health < 10) {
      console.log('Low health, returning to base')
      returnToBase = true
      setState('returning')
    }
  })

  // Tool monitoring
  setInterval(() => {
    checkTools()
  }, 60000) // Check every minute
}

// Mining logic
function mineBlock(position) {
  const block = bot.blockAt(position)
  if (!block) {
    console.log('Block not found')
    checkInventoryAndContinue()
    return
  }

  // Check if we can mine this block
  if (!bot.canDigBlock(block)) {
    console.log(`Cannot mine ${block.name}`)
    checkInventoryAndContinue()
    return
  }

  console.log(`Starting to mine ${block.name}`)
  bot.dig(block)
}

function checkInventoryAndContinue() {
  const items = bot.inventory.items()
  const usedSlots = items.length

  if (usedSlots >= CONFIG.INVENTORY_THRESHOLD || returnToBase) {
    console.log(`Inventory ${usedSlots}/36, returning to base`)
    returnToBase = false
    setState('returning')
  } else if (miningTargets.length > 0) {
    setState('mining')
  } else {
    setState('scanning')
  }
}

// Tool management
function checkTools() {
  const heldItem = bot.heldItem

  if (!heldItem || heldItem.type === 0) { // No item held
    equipBestPickaxe()
    return
  }

  // Check durability
  if (heldItem.durabilityUsed && heldItem.durabilityUsed > heldItem.durability - CONFIG.MIN_TOOL_DURABILITY) {
    console.log('Tool durability low, equipping new tool')
    equipBestPickaxe()
  }
}

function equipBestPickaxe() {
  const pickaxes = bot.inventory.items().filter(item =>
    item.name.includes('pickaxe')
  ).sort((a, b) => {
    // Sort by tier (diamond > iron > stone > wooden)
    const tierOrder = { diamond: 4, iron: 3, stone: 2, wooden: 1, golden: 0 }
    const aTier = Object.keys(tierOrder).find(tier => a.name.includes(tier)) || 'wooden'
    const bTier = Object.keys(tierOrder).find(tier => b.name.includes(tier)) || 'wooden'
    return tierOrder[bTier] - tierOrder[aTier]
  })

  if (pickaxes.length > 0) {
    bot.equip(pickaxes[0], 'hand')
    console.log(`Equipped ${pickaxes[0].name}`)
  } else {
    console.log('No pickaxes found in inventory')
  }
}

// Chest detection and management
function findNearbyChests() {
  nearbyChests = []

  for (let x = -20; x <= 20; x++) {
    for (let y = -5; y <= 5; y++) {
      for (let z = -20; z <= 20; z++) {
        const block = bot.blockAt(bot.entity.position.offset(x, y, z))
        if (block && (block.name.includes('chest') || block.name.includes('barrel'))) {
          nearbyChests.push({
            position: block.position,
            type: block.name
          })
        }
      }
    }
  }

  console.log(`Found ${nearbyChests.length} storage containers`)
}

function performDeposit() {
  // Deposit valuable items
  const valuableItems = bot.inventory.items().filter(item =>
    CONFIG.VALUABLE_ORES.some(ore => item.name.includes(ore.replace('_ore', ''))) ||
    ['diamond', 'gold_ingot', 'iron_ingot', 'emerald', 'coal'].includes(item.name)
  )

  valuableItems.forEach(item => {
    bot.tossStack(item)
  })

  console.log(`Deposited ${valuableItems.length} valuable item stacks`)
  setState('scanning')
}

// Chat commands
function setupChatCommands() {
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const command = message.toLowerCase().trim()

    switch (command) {
      case 'mine status':
        showMiningStatus()
        break
      case 'stop mining':
        setState('idle')
        bot.pathfinder.setGoal(null)
        bot.chat('Mining stopped')
        break
      case 'start mining':
        setState('scanning')
        bot.chat('Mining started')
        break
      case 'find chests':
        findNearbyChests()
        bot.chat(`Found ${nearbyChests.length} chests nearby`)
        break
    }
  })
}

function showMiningStatus() {
  const pos = bot.entity.position
  const items = bot.inventory.items()
  const usedSlots = items.length

  let status = `Status: ${currentState.toUpperCase()} | `
  status += `Position: ${Math.round(pos.x)}, ${Math.round(pos.y)}, ${Math.round(pos.z)} | `
  status += `Inventory: ${usedSlots}/36 | `
  status += `Targets: ${miningTargets.length}`

  bot.chat(status)
}

// Initialize chest detection
setInterval(() => {
  if (currentState !== 'idle') {
    findNearbyChests()
  }
}, CONFIG.CHEST_CHECK_INTERVAL)

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
