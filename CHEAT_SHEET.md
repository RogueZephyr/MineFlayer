# Minecraft Bot Development Cheat Sheet

A comprehensive reference for JavaScript, Node.js, Express.js, and Minecraft bot development tools.

## 📚 Table of Contents

- [JavaScript Fundamentals](#javascript-fundamentals)
- [Node.js Essentials](#nodejs-essentials)
- [Express.js Quick Reference](#expressjs-quick-reference)
- [Socket.IO Basics](#socketio-basics)
- [MineFlayer Patterns](#mineflayer-patterns)
- [Pathfinder Integration](#pathfinder-integration)
- [Viewer Integration](#viewer-integration)
- [Common Patterns](#common-patterns)
- [Debugging & Troubleshooting](#debugging--troubleshooting)

---

## JavaScript Fundamentals

### ES6+ Features

#### Arrow Functions
```javascript
// Traditional function
function add(a, b) { return a + b }

// Arrow function
const add = (a, b) => a + b

// With body
const multiply = (a, b) => {
  const result = a * b
  return result
}
```

#### Template Literals
```javascript
const name = 'Bot'
const message = `Hello, ${name}! Position: ${x}, ${y}, ${z}`
```

#### Destructuring
```javascript
// Array destructuring
const [x, y, z] = position

// Object destructuring
const { username, health, food } = bot

// Function parameters
function moveTo({ x, y, z }) {
  // Use x, y, z directly
}
```

#### Spread Operator
```javascript
// Arrays
const coords = [x, y, z]
const newCoords = [...coords, w]

// Objects
const botConfig = { username: 'Bot', version: '1.21.1' }
const fullConfig = { ...botConfig, host: 'localhost' }
```

#### Async/Await
```javascript
async function mineBlock(block) {
  try {
    await bot.dig(block)
    console.log('Block mined!')
  } catch (error) {
    console.error('Mining failed:', error)
  }
}
```

### Classes and Objects

```javascript
class BotController {
  constructor(bot) {
    this.bot = bot
    this.tasks = []
  }

  async executeTask(task) {
    // Implementation
  }

  static createBot(config) {
    return mineflayer.createBot(config)
  }
}

// Usage
const controller = new BotController(bot)
```

---

## Node.js Essentials

### File System Operations

```javascript
const fs = require('fs').promises

// Read file
const data = await fs.readFile('config.json', 'utf8')
const config = JSON.parse(data)

// Write file
await fs.writeFile('output.json', JSON.stringify(data, null, 2))

// Check if file exists
const exists = await fs.access('file.txt').then(() => true).catch(() => false)

// Create directory
await fs.mkdir('logs', { recursive: true })
```

### Process Management

```javascript
// Command line arguments
const args = process.argv.slice(2)
const host = args[0] || 'localhost'

// Environment variables
const port = process.env.PORT || 25565
const debug = process.env.DEBUG === 'true'

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...')
  bot.quit('Server shutdown')
  process.exit(0)
})

// Current working directory
const cwd = process.cwd()
```

### Modules and Imports

```javascript
// CommonJS
const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')

// ES6 Modules (with "type": "module" in package.json)
import mineflayer from 'mineflayer'
import { Vec3 } from 'vec3'

// Dynamic imports
const pathfinder = await import('mineflayer-pathfinder')
```

### Event Emitters

```javascript
const EventEmitter = require('events')

class BotManager extends EventEmitter {
  constructor() {
    super()
    this.bots = new Map()
  }

  addBot(bot) {
    this.bots.set(bot.username, bot)
    this.emit('botAdded', bot)
  }
}

const manager = new BotManager()
manager.on('botAdded', (bot) => {
  console.log(`Bot ${bot.username} added`)
})
```

---

## Express.js Quick Reference

### Basic Server Setup

```javascript
const express = require('express')
const app = express()
const port = 8080

// Middleware
app.use(express.json())
app.use(express.static('public'))

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/api/bots', (req, res) => {
  res.json(manager.getBotInfo())
})

app.post('/api/bots/:id/chat', (req, res) => {
  const { id } = req.params
  const { message } = req.body

  manager.sendChatToBot(id, message)
  res.json({ success: true })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(port, () => {
  console.log(`Dashboard running at http://localhost:${port}`)
})
```

### Route Parameters and Query Strings

```javascript
// Route parameters
app.get('/bots/:id', (req, res) => {
  const botId = req.params.id
  // Handle request
})

// Query parameters
app.get('/bots', (req, res) => {
  const { status, type } = req.query
  // status and type from ?status=online&type=worker
})
```

### Middleware Examples

```javascript
// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  // Verify token
  next()
}
```

---

## Socket.IO Basics

### Server Setup

```javascript
const express = require('express')
const { Server } = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Join room
  socket.join('bot-control')

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// Broadcast to all clients
const broadcastUpdate = (event, data) => {
  io.emit(event, data)
}

// Send to specific room
const sendToRoom = (room, event, data) => {
  io.to(room).emit(event, data)
}

module.exports = { io, broadcastUpdate, sendToRoom }
```

### Client Setup

```javascript
const socket = io('http://localhost:8080')

// Connection events
socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// Custom events
socket.on('bot_update', (data) => {
  updateBotDisplay(data)
})

socket.on('telemetry', (data) => {
  updateTelemetry(data)
})

// Sending events
const sendCommand = (command, data) => {
  socket.emit('bot_command', { command, data })
}
```

### Namespaces and Rooms

```javascript
// Server - Namespaces
const adminIO = io.of('/admin')
adminIO.on('connection', (socket) => {
  // Admin namespace handling
})

// Server - Rooms
socket.join('bot-control')
socket.leave('spectator')

// Broadcast to room
io.to('bot-control').emit('update', data)

// Client - Namespaces
const adminSocket = io('/admin')
```

---

## MineFlayer Patterns

### Bot Creation and Configuration

```javascript
const createBot = (config) => {
  const bot = mineflayer.createBot({
    host: config.host || 'localhost',
    port: config.port || 25565,
    username: config.username || 'Bot',
    version: config.version || '1.21.1',
    auth: config.auth || 'mojang'
  })

  // Error handling
  bot.on('error', (err) => {
    console.error(`Bot error: ${err.message}`)
  })

  bot.on('kicked', (reason) => {
    console.log(`Bot kicked: ${reason}`)
  })

  bot.on('end', () => {
    console.log('Bot disconnected')
  })

  return bot
}
```

### Event Handling Patterns

```javascript
const setupEventHandlers = (bot) => {
  // Spawn handling
  bot.once('spawn', () => {
    console.log(`${bot.username} spawned!`)
    initializeBot(bot)
  })

  // Health monitoring
  bot.on('health', () => {
    const healthPercent = (bot.health / 20) * 100
    if (healthPercent < 25) {
      console.log('Low health! Healing needed.')
    }
  })

  // Chat handling with pattern matching
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    // Command parsing
    if (message.startsWith('!')) {
      handleCommand(bot, username, message.substring(1))
    }
  })
}
```

### Position and Movement

```javascript
// Get current position
const getPosition = (bot) => {
  const pos = bot.entity.position
  return {
    x: Math.round(pos.x * 100) / 100,
    y: Math.round(pos.y * 100) / 100,
    z: Math.round(pos.z * 100) / 100
  }
}

// Move to coordinates
const moveTo = async (bot, x, y, z) => {
  const goal = new GoalNear(x, y, z, 1)
  bot.pathfinder.setGoal(goal)

  return new Promise((resolve) => {
    const onGoalReached = () => {
      bot.removeListener('goal_reached', onGoalReached)
      resolve()
    }
    bot.once('goal_reached', onGoalReached)
  })
}

// Look at position
const lookAt = async (bot, x, y, z) => {
  await bot.lookAt(new Vec3(x, y, z))
}
```

### Inventory Management

```javascript
// Find item in inventory
const findItem = (bot, itemName) => {
  return bot.inventory.items().find(item =>
    item.name.includes(itemName.toLowerCase())
  )
}

// Equip item
const equipItem = async (bot, itemName, destination = 'hand') => {
  const item = findItem(bot, itemName)
  if (item) {
    await bot.equip(item, destination)
    return true
  }
  return false
}

// Count items
const countItems = (bot, itemName) => {
  return bot.inventory.items()
    .filter(item => item.name.includes(itemName.toLowerCase()))
    .reduce((total, item) => total + item.count, 0)
}
```

### Block Operations

```javascript
// Get block at position
const getBlockAt = (bot, x, y, z) => {
  return bot.blockAt(new Vec3(x, y, z))
}

// Check if block is safe to walk on
const isSafeBlock = (block) => {
  const unsafeBlocks = ['lava', 'fire', 'cactus', 'air']
  return block && !unsafeBlocks.includes(block.name)
}

// Find nearest block of type
const findNearestBlock = (bot, blockName, maxDistance = 64) => {
  const blocks = bot.findBlocks({
    matching: (block) => block.name === blockName,
    maxDistance: maxDistance,
    count: 1
  })

  if (blocks.length > 0) {
    return bot.blockAt(blocks[0])
  }
  return null
}
```

---

## Pathfinder Integration

### Basic Setup

```javascript
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear, GoalBlock, GoalXZ } = require('mineflayer-pathfinder').goals

// Initialize pathfinder
bot.loadPlugin(pathfinder)

// Configure movements
const movements = new Movements(bot)
movements.canDig = true
movements.allowParkour = true
bot.pathfinder.setMovements(movements)
```

### Common Goals

```javascript
// Move near a position
const goal = new GoalNear(x, y, z, range)

// Move to specific block
const goal = new GoalBlock(x, y, z)

// Move to XZ coordinates (any Y)
const goal = new GoalXZ(x, z)

// Set and monitor goal
bot.pathfinder.setGoal(goal)

bot.on('goal_reached', () => {
  console.log('Destination reached!')
})

bot.on('path_update', (results) => {
  if (results.status === 'noPath') {
    console.log('No path found!')
  }
})
```

### Advanced Movement Configuration

```javascript
const movements = new Movements(bot)

// Allow digging blocks
movements.canDig = true

// Allow parkour jumps
movements.allowParkour = true

// Allow sprinting
movements.allowSprinting = true

// Custom movement costs
movements.liquidCost = 2 // Higher cost for water/lava
movements.entityCost = 10 // Avoid entities

// Custom exclusion areas
movements.exclusionAreasStep.push((block) => {
  // Custom logic for avoiding certain blocks
  if (block.name === 'lava') return 100 // Impossible
  return 0 // Normal cost
})
```

---

## Viewer Integration

### Basic Viewer Setup

```javascript
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')

// Start viewer
mineflayerViewer(bot, {
  port: 3000,
  firstPerson: false,
  viewDistance: 16
})

console.log('Viewer running at http://localhost:3000')
```

### Viewer Controls

```javascript
// Draw path in viewer
bot.on('path_update', (path) => {
  if (path.path && path.path.length > 0) {
    bot.viewer.erase('path')
    const points = path.path.map(node => node.position)
    bot.viewer.drawLine('path', points, 0x00FF00, 2)
  }
})

// Draw waypoints
const drawWaypoint = (position, color = 0xFF0000) => {
  bot.viewer.drawBox('waypoint', position, { x: 1, y: 1, z: 1 }, color)
}

// Clear drawings
bot.viewer.erase('path')
bot.viewer.erase('waypoint')
```

### Advanced Viewer Features

```javascript
// Set camera position
bot.viewer.setFirstPersonCamera(
  bot.entity.position,
  bot.entity.yaw,
  bot.entity.pitch
)

// Draw complex shapes
bot.viewer.drawBox('structure', position, size, color)
bot.viewer.drawLine('connection', [start, end], color, width)

// Update entities
bot.on('entitySpawn', (entity) => {
  // Custom entity rendering
})

bot.on('entityGone', (entity) => {
  // Clean up entity rendering
})
```

---

## Common Patterns

### Singleton Bot Manager

```javascript
class BotManager {
  constructor() {
    this.bots = new Map()
  }

  createBot(config) {
    const bot = mineflayer.createBot(config)
    this.bots.set(config.username, bot)
    return bot
  }

  getBot(username) {
    return this.bots.get(username)
  }

  broadcastChat(message) {
    for (const bot of this.bots.values()) {
      bot.chat(message)
    }
  }
}

const manager = new BotManager()
```

### Command Parser

```javascript
class CommandParser {
  constructor(bot) {
    this.bot = bot
    this.commands = new Map()
  }

  register(command, handler) {
    this.commands.set(command.toLowerCase(), handler)
  }

  parse(message) {
    const parts = message.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    const handler = this.commands.get(command)
    if (handler) {
      handler(this.bot, ...args)
    }
  }
}

// Usage
const parser = new CommandParser(bot)
parser.register('goto', (bot, x, y, z) => {
  // Handle goto command
})
```

### State Machine

```javascript
class BotStateMachine {
  constructor(bot) {
    this.bot = bot
    this.currentState = 'idle'
    this.states = new Map()
  }

  addState(name, { enter, update, exit }) {
    this.states.set(name, { enter, update, exit })
  }

  transition(newState) {
    const current = this.states.get(this.currentState)
    if (current && current.exit) {
      current.exit(this.bot)
    }

    this.currentState = newState

    const next = this.states.get(newState)
    if (next && next.enter) {
      next.enter(this.bot)
    }
  }

  update() {
    const state = this.states.get(this.currentState)
    if (state && state.update) {
      state.update(this.bot)
    }
  }
}
```

### Error Handling

```javascript
const withErrorHandling = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error(`Error in ${fn.name}:`, error)
      // Handle error appropriately
      throw error
    }
  }
}

// Usage
const safeDig = withErrorHandling(async (bot, block) => {
  await bot.dig(block)
  return 'Block dug successfully'
})
```

---

## Debugging & Troubleshooting

### Common Issues

```javascript
// Connection issues
bot.on('error', (err) => {
  console.error('Connection error:', err.code, err.message)
  // Common codes: ECONNREFUSED, ETIMEDOUT, ENOTFOUND
})

// Pathfinding issues
bot.on('path_update', (results) => {
  if (results.status === 'noPath') {
    console.log('No path found. Checking obstacles...')
    // Debug: Check for blocking entities or blocks
  }
})

// Memory leaks
setInterval(() => {
  const memUsage = process.memoryUsage()
  console.log(`Memory: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`)
}, 30000)
```

### Logging Best Practices

```javascript
const logger = {
  info: (message, ...args) => {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`, ...args)
  },

  error: (message, error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error)
  },

  debug: (message, ...args) => {
    if (process.env.DEBUG) {
      console.debug(`[${new Date().toISOString()}] DEBUG: ${message}`, ...args)
    }
  }
}

// Usage
logger.info('Bot spawned successfully')
logger.error('Failed to connect', error)
logger.debug('Pathfinding calculation started', { start, goal })
```

### Performance Monitoring

```javascript
const performanceMonitor = {
  startTime: Date.now(),
  operations: 0,

  logOperation(operation) {
    this.operations++
    const elapsed = Date.now() - this.startTime
    const opsPerSecond = (this.operations / elapsed) * 1000

    console.log(`${operation}: ${opsPerSecond.toFixed(2)} ops/sec`)
  },

  reset() {
    this.startTime = Date.now()
    this.operations = 0
  }
}

// Usage
performanceMonitor.logOperation('pathfinding')
```

---

## Quick Reference

### MineFlayer Events
- `spawn` - Bot spawned
- `health` - Health/food changed
- `move` - Bot moved
- `chat` - Player chat
- `diggingCompleted` - Block dug
- `goal_reached` - Pathfinder goal reached

### Common Vec3 Operations
```javascript
const pos = new Vec3(1, 2, 3)
const offset = pos.offset(1, 0, 1) // Add to position
const distance = pos.distanceTo(otherPos)
const clone = pos.clone()
```

### Block Properties
```javascript
const block = bot.blockAt(pos)
console.log(block.name)        // Block type
console.log(block.position)    // Position
console.log(block.metadata)    // Block state
console.log(block.diggable)    // Can be dug
```

### Inventory Operations
```javascript
const items = bot.inventory.items()
const item = bot.inventory.slots[36] // Hotbar slot
await bot.equip(item, 'hand')
```

Remember: This is a living document. Update it as you learn new patterns and techniques!
