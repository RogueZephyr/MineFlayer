# Frequently Asked Questions (FAQ)

## Table of Contents
- [General Questions](#general-questions)
- [Installation & Setup](#installation--setup)
- [Bot Management](#bot-management)
- [Dashboard & Web Interface](#dashboard--web-interface)
- [Chat Commands](#chat-commands)
- [Movement & Pathfinding](#movement--pathfinding)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## General Questions

### What is MineFlayer?
MineFlayer is a Node.js library for creating Minecraft bots. This project provides a web dashboard for managing multiple MineFlayer bots with real-time monitoring and control.

### What can the bots do?
- Connect to Minecraft servers
- Move around autonomously
- Mine blocks and collect resources
- Interact with chests and inventory
- Respond to chat commands
- Follow complex pathfinding routes
- Monitor health and automatically seek safety

### Is this allowed on Minecraft servers?
- **Educational servers**: Generally allowed for learning purposes
- **Public servers**: Check the server's rules - many prohibit bots
- **Private servers**: You control the rules
- **Always respect the Minecraft EULA and server rules**

## Installation & Setup

### Node.js Version Requirements
- **Minimum**: Node.js v14
- **Recommended**: Node.js v16 or higher
- **Check version**: `node --version`

### Minecraft Server Compatibility
- Works with **any non-modded Minecraft server**
- Supports **Bukkit/Spigot/Paper** servers
- Compatible with **vanilla Minecraft servers**
- **Not compatible** with heavily modded servers (e.g., those requiring specific mods)

### Port Configuration
- **Default Minecraft port**: 25565
- **Dashboard port**: 8080 (configurable in `server.js`)
- **Viewer ports**: Start at 3000 (auto-incremented)

## Bot Management

### How many bots can I run?
- **Theoretical limit**: Limited by your system's resources
- **Practical limit**: 10-20 bots depending on your hardware
- **Performance**: Each bot uses ~50-100MB RAM

### Bot Names and Identification
- Bots are identified by username
- Auto-generated names: `BOT_0`, `BOT_1`, etc.
- Custom names supported
- Names must be unique per server

### Auto-Reconnection
- Bots automatically reconnect on disconnection
- **Reconnection delay**: 10 seconds
- **Max retry attempts**: Unlimited
- Manual intervention may be needed for persistent connection issues

## Dashboard & Web Interface

### Accessing the Dashboard
1. Start the server: `npm start`
2. Open browser: `http://localhost:8080`
3. Dashboard loads automatically

### Dashboard Features
- **Real-time telemetry**: Position, health, food, dimension
- **Live viewers**: Integrated Prismarine Viewer
- **Grid/Single modes**: View multiple bots or focus on one
- **Bot pinning**: Keep important bots in grid view
- **Log filtering**: Filter logs by selected bot

### Socket.IO Connection Issues
- **Firewall**: Ensure ports 8080 and viewer ports are open
- **Network**: Check if WebSocket connections are blocked
- **Browser**: Try a different browser (Chrome recommended)

## Chat Commands

### Basic Commands
- `mine status` - Show current mining status
- `start mining` - Begin automated mining
- `stop mining` - Stop all mining operations
- `find chests` - Scan for nearby storage containers

### Short Commands
- `status` - Same as `mine status`
- `start` - Same as `start mining`
- `stop` - Same as `stop mining`
- `chests` - Same as `find chests`

### Chat Command Issues

#### "No Chat Report" Mod Problem
- **Symptom**: Chat commands appear as undefined/empty
- **Cause**: Client-side "No Chat Report" mod interferes with chat processing
- **Solutions**:
  - Disable the "No Chat Report" mod
  - Use vanilla Minecraft client
  - Switch to a different client mod setup

#### Chat Message Debugging
If chat commands aren't working:
1. Check console logs for detailed JSON structure
2. Verify you're not using problematic client mods
3. Try commands in different formats (full vs short)
4. Check for Minecraft formatting codes in messages

## Movement & Pathfinding

### Movement Types
- **Walking**: Basic movement to coordinates
- **Jumping**: Handles obstacles and terrain
- **Sprinting**: Faster movement (uses hunger)
- **Pathfinding**: Advanced navigation with obstacle avoidance

### Pathfinding Features
- **Mineflayer Pathfinder**: Advanced A* pathfinding
- **Obstacle avoidance**: Automatically navigates around blocks
- **Terrain adaptation**: Handles stairs, slopes, and drops
- **Safety protocols**: Avoids dangerous areas (lava, cliffs)

### Movement Commands
- `walkToPosition(x, y, z)` - Move to specific coordinates
- `jump()` - Make bot jump
- `sprintTo(x, z)` - Sprint to coordinates
- `navigateTo(x, y, z)` - Advanced navigation with obstacle avoidance

## Troubleshooting

### Connection Issues
```
Error: Connection refused
```
- **Server not running**: Start your Minecraft server
- **Wrong host/port**: Check server configuration in `server.js`
- **Firewall**: Ensure ports are open
- **Version mismatch**: Verify Minecraft version compatibility

### Viewer Not Loading
```
Viewer iframe shows blank
```
- **Port conflict**: Check if viewer ports (3000+) are available
- **Canvas dependency**: Ensure `canvas` package is installed
- **Browser compatibility**: Try Chrome or Firefox

### Bot Disconnection
```
Bot kicked: Connection lost
```
- **Server restart**: Bots will auto-reconnect
- **Network issues**: Check internet connection
- **Server overload**: Too many bots may cause server lag

### Memory Issues
```
JavaScript heap out of memory
```
- **Reduce bot count**: Run fewer simultaneous bots
- **Increase Node.js memory**: `node --max-old-space-size=4096`
- **Monitor resources**: Check system RAM usage

### Pathfinding Problems
```
No path found to target
```
- **Obstacles**: Clear path to destination
- **Complex terrain**: Simplify the route
- **Range limit**: Target may be too far (max ~50 blocks)
- **Safety settings**: Bot may be avoiding dangerous areas

## Development

### Adding New Bot Behaviors
1. **Extend `utils/botFactory.js`**: Add methods to `MCBot` class
2. **Update dashboard**: Add UI controls in `public/app.js`
3. **Add Socket.IO handlers**: Update `server.js` for new commands
4. **Test thoroughly**: Verify functionality with different scenarios

### Custom Movement Systems
```javascript
// Example: Add custom movement method
class MCBot {
  async customMovement(x, y, z) {
    // Your custom logic here
    return this.movement.walkToPosition(x, y, z)
  }
}
```

### Plugin Integration
- **Mineflayer plugins**: Add to `bot.loadPlugin()`
- **Custom plugins**: Create in separate files
- **Pathfinder integration**: Use `mineflayer-pathfinder` for advanced movement

### Code Organization
- **Bot logic**: `utils/botFactory.js`
- **Multi-bot management**: `utils/botManager.js`
- **Web interface**: `public/` directory
- **Server logic**: `server.js`
- **Examples**: `examples/` directory

## Performance Optimization

### Memory Management
- **Bot cleanup**: Properly dispose of bots when done
- **Log limits**: Keep recent logs manageable
- **Resource monitoring**: Track memory usage

### Network Optimization
- **Connection pooling**: Reuse connections where possible
- **Rate limiting**: Avoid spamming commands
- **Batch operations**: Group similar operations

### CPU Optimization
- **Pathfinding limits**: Restrict complex calculations
- **Event throttling**: Limit frequent updates
- **Background processing**: Offload heavy tasks

## Common Error Messages

### `TypeError: Cannot read property 'position' of undefined`
- **Cause**: Bot not fully spawned when accessed
- **Solution**: Wait for `'spawn'` event before using bot

### `Error: Invalid coordinates`
- **Cause**: Movement coordinates out of world bounds
- **Solution**: Check coordinate ranges (-30M to +30M)

### `Error: No path found`
- **Cause**: Pathfinding cannot reach destination
- **Solution**: Clear obstacles or choose closer target

### `Error: Bot not found`
- **Cause**: Bot was killed or disconnected
- **Solution**: Check bot status before commands

## Getting Help

### Debug Mode
Enable detailed logging:
```javascript
// Add to your bot code
bot.on('chat', (username, message) => {
  console.log('Raw message:', JSON.stringify(message, null, 2))
})
```

### Log Analysis
- **Console output**: Check for error messages
- **Dashboard logs**: Filter by bot for specific issues
- **Network logs**: Monitor connection stability

### Community Resources
- **Mineflayer GitHub**: https://github.com/PrismarineJS/mineflayer
- **Discord**: Join Minecraft bot development communities
- **Issues**: Report bugs on the project repository

---

## Quick Reference

### Essential Commands
```bash
# Start dashboard
npm start

# Run with increased memory
node --max-old-space-size=4096 server.js

# Debug mode
DEBUG=* npm start
```

### Key Files
- `server.js` - Main server and bot management
- `utils/botFactory.js` - Individual bot implementation
- `public/app.js` - Dashboard frontend
- `examples/` - Sample bot implementations

### Important Ports
- **Dashboard**: 8080
- **Minecraft**: 25565 (default)
- **Viewers**: 3000+ (auto-assigned)

---

*Last updated: September 2025*
*For the latest information, check the project repository*
