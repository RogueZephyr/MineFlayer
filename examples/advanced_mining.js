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

  // First, check for ores right in front of the bot
  checkForImmediateOres()

  // If no immediate ores found, start scanning
  if (miningTargets.length === 0) {
    setState('scanning')
  } else {
    setState('mining')
  }
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

// Scanning for mining targets using Mineflayer's efficient findBlocks method
function startScanning() {
  console.log('Scanning for valuable ores using findBlocks...')

  miningTargets = []
  const botPos = bot.entity.position

  // Use Mineflayer's efficient findBlocks method for each ore type
  for (const oreName of CONFIG.VALUABLE_ORES) {
    const blockId = bot.registry.blocksByName[oreName]?.id
    if (!blockId) {
      console.log(`Warning: ${oreName} not found in registry`)
      continue
    }

    try {
      // Find blocks using Mineflayer's optimized algorithm
      const blocks = bot.findBlocks({
        matching: [blockId],
        maxDistance: CONFIG.MINING_RADIUS,
        count: 10 // Limit per ore type to prevent overload
      })

      console.log(`Found ${blocks.length} ${oreName} blocks`)

      // Convert to our target format
      for (const blockPos of blocks) {
        const distance = botPos.distanceTo(blockPos)
        miningTargets.push({
          position: blockPos,
          type: oreName,
          distance: distance
        })
      }
    } catch (error) {
      console.log(`Error finding ${oreName}: ${error.message}`)
    }
  }

  // Sort by distance (closest first)
  miningTargets.sort((a, b) => a.distance - b.distance)

  if (miningTargets.length > 0) {
    console.log(`\n=== SCAN COMPLETE ===`)
    console.log(`Found ${miningTargets.length} mining targets:`)
    miningTargets.forEach((target, index) => {
      console.log(`${index + 1}. ${target.type} at ${Math.round(target.position.x)}, ${Math.round(target.position.y)}, ${Math.round(target.position.z)} (${target.distance.toFixed(1)} blocks away)`)
    })
    console.log(`\nStarting with closest target: ${miningTargets[0].type} (${miningTargets[0].distance.toFixed(1)} blocks away)`)
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

  // Clear any existing goals first
  bot.pathfinder.setGoal(null)

  // Set new goal
  const goal = new GoalBlock(currentTarget.position.x, currentTarget.position.y, currentTarget.position.z)
  bot.pathfinder.setGoal(goal)

  // Verify movement started
  setTimeout(() => {
    if (currentState === 'mining' && currentTarget) {
      const distance = bot.entity.position.distanceTo(currentTarget.position)
      console.log(`Distance to target: ${distance.toFixed(2)} blocks`)

      if (distance > 3) {
        console.log('Bot may not be moving, checking path...')
        // Force a path update check
        bot.pathfinder.stop()
        setTimeout(() => {
          if (currentState === 'mining') {
            console.log('Retrying path to target...')
            bot.pathfinder.setGoal(goal)
          }
        }, 1000)
      }
    }
  }, 3000) // Check after 3 seconds

  // Set a timeout for mining operation
  setTimeout(() => {
    if (currentState === 'mining' && currentTarget) {
      console.log('Mining timeout reached, moving to next target')
      setState('mining') // Try next target
    }
  }, 30000) // 30 second timeout per mining operation
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
  // Position tracking for movement verification
  let lastPosition = null
  let stuckCounter = 0

  setInterval(() => {
    if (bot.entity && currentState === 'mining') {
      const currentPos = bot.entity.position
      if (lastPosition) {
        const distance = currentPos.distanceTo(lastPosition)
        if (distance < 0.1) { // Bot hasn't moved much
          stuckCounter++
          if (stuckCounter >= 5) { // Stuck for 5 seconds
            console.log('Bot appears stuck, resetting pathfinder')
            bot.pathfinder.stop()
            setTimeout(() => {
              if (currentState === 'mining' && currentTarget) {
                const goal = new GoalBlock(currentTarget.position.x, currentTarget.position.y, currentTarget.position.z)
                bot.pathfinder.setGoal(goal)
                stuckCounter = 0
              }
            }, 1000)
          }
        } else {
          stuckCounter = 0
        }
      }
      lastPosition = currentPos.clone()
    }
  }, 1000) // Check every second

  // Pathfinding events
  bot.on('goal_reached', (goal) => {
    console.log('Goal reached successfully!')
    stuckCounter = 0 // Reset stuck counter

    switch (currentState) {
      case 'mining':
        if (currentTarget) {
          console.log(`Reached mining target: ${currentTarget.type}`)
          mineBlock(currentTarget.position)
        }
        break
      case 'returning':
        console.log('Reached base location')
        setState('depositing')
        break
      case 'depositing':
        console.log('Reached deposit location')
        performDeposit()
        break
    }
  })

  bot.on('path_update', (results) => {
    console.log(`Path update: ${results.status}`)
    if (results.status === 'noPath') {
      console.log('No path found to target, skipping...')
      if (currentState === 'mining') {
        setState('mining') // Try next target
      }
    } else if (results.status === 'success') {
      console.log('Path found successfully')
    } else if (results.status === 'partial') {
      console.log('Partial path found')
    }
  })

  bot.on('path_reset', (reason) => {
    console.log(`Path reset: ${reason}`)
  })

  // Movement events
  bot.on('move', () => {
    // Bot is moving, reset stuck counter
    if (currentState === 'mining') {
      stuckCounter = 0
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
  // Only scan if we haven't found chests recently or if we're in depositing state
  if (nearbyChests.length > 0 && currentState !== 'depositing') {
    return // Don't scan again if we already have chests
  }

  nearbyChests = []
  const scanRange = 10 // Reduced scan range

  for (let x = -scanRange; x <= scanRange; x++) {
    for (let y = -3; y <= 3; y++) {
      for (let z = -scanRange; z <= scanRange; z++) {
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

  console.log(`Chest scan complete. Found ${nearbyChests.length} storage containers`)
}

async function performDeposit() {
  if (nearbyChests.length === 0) {
    console.log('No chests available for depositing')
    setState('scanning')
    return
  }

  // Find nearest chest
  const botPos = bot.entity.position
  nearbyChests.sort((a, b) => botPos.distanceTo(a.position) - botPos.distanceTo(b.position))
  const nearestChest = nearbyChests[0]

  try {
    // Open the chest
    const chest = await bot.openChest(nearestChest.position)
    console.log(`Opened ${nearestChest.type} at ${nearestChest.position}`)

    // Get valuable items to deposit
    const valuableItems = bot.inventory.items().filter(item =>
      CONFIG.VALUABLE_ORES.some(ore => item.name.includes(ore.replace('_ore', ''))) ||
      ['diamond', 'gold_ingot', 'iron_ingot', 'emerald', 'coal'].includes(item.name)
    )

    let depositedCount = 0
    for (const item of valuableItems) {
      try {
        await chest.deposit(item.type, null, item.count)
        console.log(`Deposited ${item.count}x ${item.name}`)
        depositedCount++
      } catch (err) {
        console.log(`Failed to deposit ${item.name}: ${err.message}`)
      }
    }

    // Close the chest
    chest.close()
    console.log(`Deposit complete. Deposited ${depositedCount} item stacks`)

  } catch (err) {
    console.log(`Failed to deposit items: ${err.message}`)
    // Fallback to tossing items if chest interaction fails
    const valuableItems = bot.inventory.items().filter(item =>
      CONFIG.VALUABLE_ORES.some(ore => item.name.includes(ore.replace('_ore', ''))) ||
      ['diamond', 'gold_ingot', 'iron_ingot', 'emerald', 'coal'].includes(item.name)
    )

    valuableItems.forEach(item => {
      bot.tossStack(item)
    })
    console.log(`Fallback: Tossed ${valuableItems.length} valuable item stacks`)
  }

  setState('scanning')
}

// Chat message logger (following Mineflayer best practices)
function chatLog(username, ...msg) {
  if (username !== bot.username) {
    console.log(`[${username}]`, ...msg)
  }
}

// Chat commands
function setupChatCommands() {
  bot.on('chat', (username, jsonMsg) => {
    // Log all chat messages first (following the exact pattern from GitHub)
    chatLog(username, jsonMsg)

    // Don't respond to own messages
    if (username === bot.username) return

    // Debug: Log the raw jsonMsg structure
    console.log('Raw jsonMsg:', JSON.stringify(jsonMsg, null, 2))

    // Extract text from JSON message object
    let messageText = ''

    try {
      if (typeof jsonMsg === 'string') {
        messageText = jsonMsg
      } else if (jsonMsg && typeof jsonMsg === 'object') {
        // Try different ways to extract text
        if (jsonMsg.text) {
          messageText = jsonMsg.text
        } else if (jsonMsg.translate) {
          // Handle translated messages
          messageText = jsonMsg.translate
        } else if (Array.isArray(jsonMsg.extra)) {
          // Handle complex message objects with extra formatting
          messageText = jsonMsg.extra.map(part => {
            if (typeof part === 'string') return part
            if (part && part.text) return part.text
            return ''
          }).join('')
        } else {
          // Fallback: try to stringify and see if it contains text
          const str = JSON.stringify(jsonMsg)
          console.log('JSON stringified:', str)
        }
      }

      console.log(`Extracted message text: "${messageText}"`)

      // Handle empty messages
      if (!messageText || messageText.trim() === '') {
        console.log('Received empty message text, ignoring')
        return
      }

      // Clean the message
      let cleanMessage = messageText.toString()

      // Remove Minecraft formatting codes (like §a, §f, etc.)
      cleanMessage = cleanMessage.replace(/§[0-9a-fk-or]/g, '')

      // Trim whitespace
      cleanMessage = cleanMessage.trim()

      console.log(`Cleaned message: "${cleanMessage}"`)

      const command = cleanMessage.toLowerCase().trim()

      console.log(`Processing command: "${command}"`)

      switch (command) {
        case 'mine status':
        case 'status':
          console.log('Executing: mine status')
          showMiningStatus()
          break
        case 'stop mining':
        case 'stop':
          console.log('Executing: stop mining')
          setState('idle')
          bot.pathfinder.setGoal(null)
          bot.chat('Mining stopped')
          break
        case 'start mining':
        case 'start':
          console.log('Executing: start mining')
          setState('scanning')
          bot.chat('Mining started')
          break
        case 'find chests':
        case 'chests':
          console.log('Executing: find chests')
          findNearbyChests()
          bot.chat(`Found ${nearbyChests.length} chests nearby`)
          break
        default:
          console.log(`Unknown command: "${command}"`)
          // Try partial matching for common words
          if (command.includes('status')) {
            console.log('Partial match: status')
            showMiningStatus()
          } else if (command.includes('stop')) {
            console.log('Partial match: stop')
            setState('idle')
            bot.pathfinder.setGoal(null)
            bot.chat('Mining stopped')
          } else if (command.includes('start')) {
            console.log('Partial match: start')
            setState('scanning')
            bot.chat('Mining started')
          }
      }

    } catch (error) {
      console.error('Error processing chat message:', error)
      console.error('jsonMsg that caused error:', jsonMsg)
    }
  })

  // Add a test command to verify chat is working
  setTimeout(() => {
    console.log('Chat commands initialized. Test with: "mine status", "status", "start", "stop", or "chests"')
  }, 5000)
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

// Check for ores immediately around the bot using findBlocks
function checkForImmediateOres() {
  console.log('Checking for ores right in front of the bot using findBlocks...')
  const botPos = bot.entity.position
  let immediateOresFound = 0

  // Use findBlocks with very short range for immediate ores
  for (const oreName of CONFIG.VALUABLE_ORES) {
    const blockId = bot.registry.blocksByName[oreName]?.id
    if (!blockId) continue

    try {
      // Find blocks within very close range (5 blocks)
      const blocks = bot.findBlocks({
        matching: [blockId],
        maxDistance: 5,
        count: 5 // Limit to prevent overload
      })

      // Convert to our target format
      for (const blockPos of blocks) {
        const distance = botPos.distanceTo(blockPos)
        miningTargets.push({
          position: blockPos,
          type: oreName,
          distance: distance
        })
        console.log(`Found immediate ${oreName} at distance ${distance.toFixed(1)} blocks`)
        immediateOresFound++
      }
    } catch (error) {
      console.log(`Error finding immediate ${oreName}: ${error.message}`)
    }
  }

  // Sort immediate ores by distance
  if (immediateOresFound > 0) {
    miningTargets.sort((a, b) => a.distance - b.distance)
    console.log(`Found ${immediateOresFound} ores immediately around the bot!`)
  } else {
    console.log('No ores found immediately around the bot')
  }
}

// Initialize chest detection - only scan when needed
let lastChestScan = 0
setInterval(() => {
  const now = Date.now()
  // Only scan if we haven't scanned recently and we're not idle
  if (currentState !== 'idle' && (now - lastChestScan) > CONFIG.CHEST_CHECK_INTERVAL) {
    findNearbyChests()
    lastChestScan = now
  }
}, 5000) // Check every 5 seconds if we need to scan

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
