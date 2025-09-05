/**
 * Advanced Example: Automated Building with Schematic Loading and Construction
 *
 * This example demonstrates a sophisticated building bot that can:
 * - Load and interpret building schematics
 * - Plan multi-step construction sequences
 * - Handle complex building patterns
 * - Manage building materials automatically
 * - Coordinate with other bots for large projects
 * - Validate construction quality
 *
 * Features demonstrated:
 * - Schematic file parsing and interpretation
 * - Advanced pathfinding for construction navigation
 * - Material requirement calculation
 * - Multi-step building workflows
 * - Construction validation and error correction
 * - Collaborative building with other bots
 */

const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear, GoalBlock, GoalCompositeAll } = require('mineflayer-pathfinder').goals

// Bot configuration
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'BuilderBot',
  version: '1.21.1'
})

bot.loadPlugin(pathfinder)

// Building configuration
const BUILD_CONFIG = {
  BUILD_RADIUS: 32,
  MATERIAL_CHECK_INTERVAL: 10000,
  CONSTRUCTION_TIMEOUT: 300000, // 5 minutes per major section
  VALIDATION_DISTANCE: 5,
  COORDINATION_CHANNEL: 'build_team'
}

// State management
let currentState = 'idle'
let movements = null
let currentSchematic = null
let buildQueue = []
let currentStep = null
let materialInventory = new Map()
let teamMembers = new Set()

// Simple schematic format (you would load from file in real implementation)
const SAMPLE_SCHEMATIC = {
  name: 'simple_house',
  size: { x: 7, y: 4, z: 7 },
  blocks: [
    // Foundation (layer 0)
    { pos: { x: 0, y: 0, z: 0 }, block: 'cobblestone' },
    { pos: { x: 1, y: 0, z: 0 }, block: 'cobblestone' },
    { pos: { x: 2, y: 0, z: 0 }, block: 'cobblestone' },
    { pos: { x: 3, y: 0, z: 0 }, block: 'cobblestone' },
    { pos: { x: 4, y: 0, z: 0 }, block: 'cobblestone' },
    { pos: { x: 5, y: 0, z: 0 }, block: 'cobblestone' },
    { pos: { x: 6, y: 0, z: 0 }, block: 'cobblestone' },
    // Walls (layer 1-2)
    { pos: { x: 0, y: 1, z: 0 }, block: 'oak_planks' },
    { pos: { x: 0, y: 2, z: 0 }, block: 'oak_planks' },
    { pos: { x: 6, y: 1, z: 0 }, block: 'oak_planks' },
    { pos: { x: 6, y: 2, z: 0 }, block: 'oak_planks' },
    // Roof (layer 3)
    { pos: { x: 2, y: 3, z: 0 }, block: 'oak_stairs' },
    { pos: { x: 3, y: 3, z: 0 }, block: 'oak_stairs' },
    { pos: { x: 4, y: 3, z: 0 }, block: 'oak_stairs' }
  ]
}

bot.once('spawn', () => {
  console.log('Advanced Builder Bot spawned!')

  // Configure movements for building
  movements = new Movements(bot)
  movements.canDig = true
  movements.allowParkour = true
  movements.allowSprinting = false
  movements.maxDropDown = 3

  bot.pathfinder.setMovements(movements)

  setupEventHandlers()
  setupChatCommands()
  setupTeamCoordination()

  bot.chat('Advanced Builder Bot ready! I can construct buildings from schematics.')
  bot.chat('Try: "build house", "materials", "validate", "team status"')
})

// State machine
function setState(newState) {
  console.log(`Builder state: ${currentState} -> ${newState}`)
  currentState = newState

  switch (newState) {
    case 'planning':
      planConstruction()
      break
    case 'gathering':
      gatherMaterials()
      break
    case 'building':
      startBuilding()
      break
    case 'validating':
      validateConstruction()
      break
    case 'idle':
      // Wait for commands
      break
  }
}

// Load and plan construction
function loadSchematic(schematicName) {
  // In a real implementation, you would load from file
  if (schematicName === 'house') {
    currentSchematic = SAMPLE_SCHEMATIC
    return true
  }
  return false
}

function planConstruction() {
  if (!currentSchematic) {
    console.log('No schematic loaded')
    setState('idle')
    return
  }

  console.log(`Planning construction of ${currentSchematic.name}`)

  // Calculate material requirements
  materialInventory.clear()
  currentSchematic.blocks.forEach(block => {
    const count = materialInventory.get(block.block) || 0
    materialInventory.set(block.block, count + 1)
  })

  // Create build queue ordered by height (bottom to top)
  buildQueue = currentSchematic.blocks
    .sort((a, b) => a.pos.y - b.pos.y)
    .map(block => ({
      ...block,
      worldPos: bot.entity.position.offset(block.pos.x, block.pos.y, block.pos.z)
    }))

  console.log(`Build queue: ${buildQueue.length} blocks`)
  console.log('Material requirements:', Object.fromEntries(materialInventory))

  setState('gathering')
}

// Material gathering
function gatherMaterials() {
  const missingMaterials = []

  for (const [material, required] of materialInventory) {
    const available = countMaterialInInventory(material)
    if (available < required) {
      missingMaterials.push({ material, required, available })
    }
  }

  if (missingMaterials.length === 0) {
    console.log('All materials available')
    setState('building')
    return
  }

  console.log('Missing materials:', missingMaterials)

  // Try to gather missing materials
  gatherMissingMaterials(missingMaterials)
}

function countMaterialInInventory(material) {
  return bot.inventory.items()
    .filter(item => item.name === material)
    .reduce((total, item) => total + item.count, 0)
}

function gatherMissingMaterials(missingMaterials) {
  // Simple gathering logic - look for materials in nearby chests or mine them
  const nearbyChests = findNearbyChests()

  if (nearbyChests.length > 0) {
    // Try to get materials from chests
    collectFromChests(missingMaterials, nearbyChests)
  } else {
    // Mine required materials
    mineRequiredMaterials(missingMaterials)
  }
}

function findNearbyChests() {
  const chests = []

  for (let x = -10; x <= 10; x++) {
    for (let y = -3; y <= 3; y++) {
      for (let z = -10; z <= 10; z++) {
        const block = bot.blockAt(bot.entity.position.offset(x, y, z))
        if (block && block.name.includes('chest')) {
          chests.push(block.position)
        }
      }
    }
  }

  return chests
}

function collectFromChests(missingMaterials, chestPositions) {
  // This would require more complex chest interaction logic
  console.log('Collecting materials from chests...')
  // For now, assume we got the materials
  setTimeout(() => setState('building'), 5000)
}

function mineRequiredMaterials(missingMaterials) {
  console.log('Mining required materials...')
  // This would implement mining logic for specific materials
  // For now, assume we got the materials
  setTimeout(() => setState('building'), 10000)
}

// Building execution
function startBuilding() {
  if (buildQueue.length === 0) {
    console.log('Construction complete!')
    setState('validating')
    return
  }

  currentStep = buildQueue.shift()
  console.log(`Building ${currentStep.block} at ${currentStep.worldPos}`)

  // Navigate to building position
  const goal = new GoalNear(currentStep.worldPos.x, currentStep.worldPos.y + 1, currentStep.worldPos.z, 1)
  bot.pathfinder.setGoal(goal)
}

// Construction validation
function validateConstruction() {
  console.log('Validating construction...')

  let validBlocks = 0
  let invalidBlocks = 0

  for (const block of currentSchematic.blocks) {
    const worldPos = bot.entity.position.offset(block.pos.x, block.pos.y, block.pos.z)
    const actualBlock = bot.blockAt(worldPos)

    if (actualBlock && actualBlock.name === block.block) {
      validBlocks++
    } else {
      invalidBlocks++
      console.log(`Invalid block at ${worldPos}: expected ${block.block}, got ${actualBlock?.name || 'air'}`)
    }
  }

  const accuracy = (validBlocks / (validBlocks + invalidBlocks)) * 100
  console.log(`Construction validation: ${validBlocks}/${validBlocks + invalidBlocks} blocks correct (${accuracy.toFixed(1)}%)`)

  bot.chat(`Construction complete! Accuracy: ${accuracy.toFixed(1)}%`)

  if (accuracy < 95) {
    bot.chat('Construction has errors. Consider rebuilding problematic sections.')
  }

  setState('idle')
}

// Event handlers
function setupEventHandlers() {
  bot.on('goal_reached', (goal) => {
    if (currentState === 'building' && currentStep) {
      placeBlock(currentStep)
    }
  })

  bot.on('diggingCompleted', (block) => {
    // Handle any digging that might be needed
  })

  // Health monitoring
  bot.on('health', () => {
    if (bot.health < 5) {
      console.log('Low health, pausing construction')
      bot.pathfinder.setGoal(null)
    }
  })
}

function placeBlock(step) {
  // Check if we have the required material
  const materialItem = bot.inventory.items().find(item => item.name === step.block)
  if (!materialItem) {
    console.log(`Missing material: ${step.block}`)
    // Try to get the material or skip this block
    setTimeout(() => startBuilding(), 1000)
    return
  }

  // Equip the material
  bot.equip(materialItem, 'hand').then(() => {
    // Place the block
    const referenceBlock = bot.blockAt(step.worldPos.offset(0, -1, 0))
    if (referenceBlock) {
      bot.placeBlock(referenceBlock, new Vec3(0, 1, 0)).then(() => {
        console.log(`Placed ${step.block}`)
        setTimeout(() => startBuilding(), 500)
      }).catch(err => {
        console.log(`Failed to place ${step.block}:`, err.message)
        setTimeout(() => startBuilding(), 1000)
      })
    }
  })
}

// Chat commands
function setupChatCommands() {
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const args = message.split(' ')
    const command = args[0].toLowerCase()

    switch (command) {
      case 'build':
        if (args[1]) {
          handleBuildCommand(args[1])
        } else {
          bot.chat('Usage: build <schematic_name>')
        }
        break

      case 'materials':
        showMaterialStatus()
        break

      case 'validate':
        if (currentSchematic) {
          setState('validating')
        } else {
          bot.chat('No schematic loaded')
        }
        break

      case 'stop':
        setState('idle')
        bot.pathfinder.setGoal(null)
        bot.chat('Construction stopped')
        break

      case 'status':
        showBuildStatus()
        break
    }
  })
}

function handleBuildCommand(schematicName) {
  if (loadSchematic(schematicName)) {
    bot.chat(`Loaded schematic: ${schematicName}`)
    setState('planning')
  } else {
    bot.chat(`Unknown schematic: ${schematicName}`)
  }
}

function showMaterialStatus() {
  let status = 'Material Status: '

  for (const [material, required] of materialInventory) {
    const available = countMaterialInInventory(material)
    status += `${material}: ${available}/${required} `
  }

  bot.chat(status)
}

function showBuildStatus() {
  let status = `Status: ${currentState.toUpperCase()}`

  if (currentSchematic) {
    status += ` | Schematic: ${currentSchematic.name}`
  }

  if (buildQueue.length > 0) {
    status += ` | Queue: ${buildQueue.length}`
  }

  bot.chat(status)
}

// Team coordination (basic implementation)
function setupTeamCoordination() {
  // Listen for team messages
  bot.on('chat', (username, message) => {
    if (message.startsWith('[TEAM]')) {
      handleTeamMessage(username, message.substring(6))
    }
  })
}

function handleTeamMessage(username, message) {
  console.log(`Team message from ${username}: ${message}`)

  // Basic team coordination logic
  if (message.includes('help needed')) {
    // Offer assistance
    bot.chat(`[TEAM] ${bot.username} can help with construction`)
  }
}

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
