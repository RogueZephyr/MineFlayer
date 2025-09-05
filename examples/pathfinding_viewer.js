/**
 * Basic Example: Pathfinding + Real-time Viewer Updates + Goal Setting
 *
 * This example demonstrates:
 * - Advanced pathfinding with multiple goal types
 * - Real-time viewer synchronization
 * - Dynamic goal updates
 * - Path visualization in viewer
 * - Complex movement patterns
 *
 * Features shown:
 * - Multiple goal types (Near, Block, XZ, Y)
 * - Viewer integration with path drawing
 * - Dynamic goal following
 * - Path status monitoring
 * - Complex navigation scenarios
 */

const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const {
  GoalNear,
  GoalBlock,
  GoalXZ,
  GoalY,
  GoalFollow,
  GoalCompositeAny
} = require('mineflayer-pathfinder').goals

// Bot configuration
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'PathfinderBot',
  version: '1.21.1'
})

bot.loadPlugin(pathfinder)

let movements = null
let currentGoal = null
let viewer = null

bot.once('spawn', () => {
  console.log('Pathfinder Bot spawned!')

  // Configure movements for optimal pathfinding
  movements = new Movements(bot)
  movements.allowParkour = true
  movements.allowSprinting = true
  movements.canDig = true
  bot.pathfinder.setMovements(movements)

  setupViewer()
  setupChatCommands()
  setupPathEvents()

  bot.chat('Pathfinder Bot ready! Try: "explore", "follow me", "goto x y z", "find surface"')
})

// Viewer setup with path visualization
function setupViewer() {
  try {
    const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
    viewer = mineflayerViewer(bot, {
      port: 3001,
      firstPerson: false,
      viewDistance: 16
    })
    console.log('Viewer started on port 3001')

    // Draw path lines in viewer
    bot.on('path_update', (path) => {
      if (path.path && path.path.length > 0) {
        // Clear previous path
        bot.viewer.erase('path')

        // Draw new path
        const pathPoints = path.path.map(node => node.position)
        if (pathPoints.length > 1) {
          bot.viewer.drawLine('path', pathPoints, 0x00FF00, 2)
        }
      }
    })

  } catch (err) {
    console.log('Viewer not available:', err.message)
  }
}

// Chat commands for different pathfinding scenarios
function setupChatCommands() {
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const args = message.split(' ')
    const command = args[0].toLowerCase()

    switch (command) {
      case 'goto':
        handleGotoCommand(args, username)
        break

      case 'follow':
        handleFollowCommand(username)
        break

      case 'explore':
        handleExploreCommand()
        break

      case 'surface':
        handleSurfaceCommand()
        break

      case 'stop':
        handleStopCommand()
        break

      case 'status':
        handleStatusCommand()
        break

      case 'find':
        handleFindCommand(args)
        break
    }
  })
}

// Command handlers
function handleGotoCommand(args, username) {
  if (args.length < 4) {
    bot.chat('Usage: goto <x> <y> <z>')
    return
  }

  const x = parseInt(args[1])
  const y = parseInt(args[2])
  const z = parseInt(args[3])

  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    bot.chat('Invalid coordinates!')
    return
  }

  const goal = new GoalNear(x, y, z, 1)
  bot.pathfinder.setGoal(goal)

  bot.chat(`Going to ${x}, ${y}, ${z}!`)
}

function handleFollowCommand(username) {
  const target = bot.players[username]?.entity
  if (!target) {
    bot.chat(`I don't see you, ${username}!`)
    return
  }

  const goal = new GoalFollow(target, 3)
  bot.pathfinder.setGoal(goal, true) // Dynamic goal

  bot.chat(`Following ${username}!`)
}

function handleExploreCommand() {
  // Create a composite goal to explore multiple areas
  const currentPos = bot.entity.position
  const exploreGoals = []

  // Generate random exploration points
  for (let i = 0; i < 5; i++) {
    const x = currentPos.x + (Math.random() - 0.5) * 100
    const z = currentPos.z + (Math.random() - 0.5) * 100
    const y = currentPos.y

    exploreGoals.push(new GoalXZ(x, z))
  }

  const goal = new GoalCompositeAny(exploreGoals)
  bot.pathfinder.setGoal(goal)

  bot.chat('Exploring randomly!')
}

function handleSurfaceCommand() {
  // Find the surface (highest non-air block)
  const currentPos = bot.entity.position
  let surfaceY = currentPos.y

  // Scan upwards to find surface
  for (let y = currentPos.y; y < 320; y++) {
    const block = bot.blockAt(currentPos.offset(0, y - currentPos.y, 0))
    if (block && block.name !== 'air') {
      surfaceY = y
    } else {
      break
    }
  }

  const goal = new GoalY(surfaceY)
  bot.pathfinder.setGoal(goal)

  bot.chat(`Going to surface at Y=${surfaceY}!`)
}

function handleStopCommand() {
  bot.pathfinder.setGoal(null)
  if (viewer) {
    bot.viewer.erase('path')
  }
  bot.chat('Stopping!')
}

function handleStatusCommand() {
  const pos = bot.entity.position
  const isMoving = bot.pathfinder.isMoving()
  const isMining = bot.pathfinder.isMining()
  const isBuilding = bot.pathfinder.isBuilding()

  let status = `Position: ${Math.round(pos.x)}, ${Math.round(pos.y)}, ${Math.round(pos.z)}`
  status += ` | Moving: ${isMoving}`
  if (isMining) status += ' | Mining'
  if (isBuilding) status += ' | Building'

  bot.chat(status)
}

function handleFindCommand(args) {
  if (args.length < 2) {
    bot.chat('Usage: find <block_name>')
    return
  }

  const blockName = args[1].toLowerCase()
  const blocks = bot.findBlocks({
    matching: (block) => block.name.includes(blockName),
    maxDistance: 64,
    count: 5
  })

  if (blocks.length === 0) {
    bot.chat(`No ${blockName} found nearby!`)
    return
  }

  // Go to the nearest block
  const nearestBlock = blocks[0]
  const goal = new GoalBlock(nearestBlock.x, nearestBlock.y, nearestBlock.z)
  bot.pathfinder.setGoal(goal)

  bot.chat(`Found ${blockName} at ${nearestBlock.x}, ${nearestBlock.y}, ${nearestBlock.z}!`)
}

// Pathfinding event handlers
function setupPathEvents() {
  bot.on('goal_reached', (goal) => {
    console.log('Goal reached!')
    bot.chat('Reached destination!')

    if (viewer) {
      bot.viewer.erase('path')
    }
  })

  bot.on('path_update', (results) => {
    console.log(`Path update: ${results.status}`)

    switch (results.status) {
      case 'success':
        bot.chat('Path found!')
        break
      case 'partial':
        bot.chat('Partial path found, continuing...')
        break
      case 'noPath':
        bot.chat('No path found to destination!')
        break
      case 'timeout':
        bot.chat('Pathfinding timed out!')
        break
    }
  })

  bot.on('path_reset', (reason) => {
    console.log('Path reset:', reason)
  })
}

// Advanced pathfinding features
function createComplexPath() {
  // Example of creating a complex path with multiple waypoints
  const waypoints = [
    { x: 100, y: 64, z: 100 },
    { x: 150, y: 70, z: 120 },
    { x: 200, y: 65, z: 80 }
  ]

  let currentWaypoint = 0

  const moveToNextWaypoint = () => {
    if (currentWaypoint >= waypoints.length) {
      bot.chat('Completed complex path!')
      return
    }

    const wp = waypoints[currentWaypoint]
    const goal = new GoalNear(wp.x, wp.y, wp.z, 2)
    bot.pathfinder.setGoal(goal)

    const onReached = () => {
      bot.removeListener('goal_reached', onReached)
      currentWaypoint++
      setTimeout(moveToNextWaypoint, 2000) // Pause between waypoints
    }

    bot.once('goal_reached', onReached)
  }

  moveToNextWaypoint()
}

// Utility functions
function getPathInfo() {
  const isMoving = bot.pathfinder.isMoving()
  const isMining = bot.pathfinder.isMining()
  const isBuilding = bot.pathfinder.isBuilding()

  return {
    isMoving,
    isMining,
    isBuilding,
    position: bot.entity.position,
    goal: currentGoal
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
  if (viewer) {
    viewer.close()
  }
})

// Graceful shutdown
process.on('SIGINT', () => {
  bot.quit('Shutting down')
  if (viewer) {
    viewer.close()
  }
  process.exit(0)
})

module.exports = bot
