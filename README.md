# MineFlayer Bot Dashboard

A comprehensive Minecraft bot management system built with MineFlayer, featuring a real-time web dashboard for controlling multiple bots, viewing live streams, and monitoring telemetry.

## Features

- **Multi-Bot Management**: Spawn and control multiple Minecraft bots simultaneously
- **Real-Time Dashboard**: Web-based interface for bot management
- **Live Viewers**: Integrated Prismarine Viewer for real-time bot perspectives
- **Telemetry Monitoring**: Track bot position, health, food, and dimension
- **Chat Interface**: Send messages and commands to bots
- **Grid/Single Viewer Modes**: View multiple bots in a grid or focus on one
- **Bot Pinning**: Pin bots to grid view for persistent monitoring
- **Logging System**: Real-time logs with filtering capabilities
- **Auto-Reconnection**: Bots automatically reconnect on disconnection

## Prerequisites

- Node.js (v14 or higher)
- A Minecraft server to connect to (works with any non-modded server type)
- Basic understanding of Minecraft and bot automation

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RogueZephyr/MineFlayer.git
   cd MineFlayer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Minecraft server details in `server.js`:
   ```javascript
   const manager = new BotManager({
     host: 'your-server-ip',  // e.g., 'localhost' or 'your-server.com'
     port: 25565,             // Default Minecraft port
     version: '1.21.1'        // Minecraft version
   });
   ```

## Usage

### Web Dashboard

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:8080`

3. Use the dashboard to:
   - Spawn individual bots with custom names
   - Spawn multiple bots at once
   - Kill specific bots or all bots
   - Send chat messages to bots
   - Monitor bot telemetry (position, health, etc.)
   - View live bot perspectives
   - Filter logs by selected bot

### CLI Tool

Alternatively, use the CLI for basic bot spawning:

```bash
node index.js
```

Follow the prompts to specify the number of bots to spawn.

## Project Structure

```
MineFlayer/
├── index.js                 # CLI entry point for spawning bots
├── server.js                # Express server with Socket.IO
├── package.json             # Project dependencies and scripts
├── README.md                # This file
├── API_REFERENCE.md         # API documentation
├── CHEAT_SHEET.md           # Quick reference
├── FAQ.md                   # Frequently asked questions
├── .gitignore               # Git ignore file
├── package-lock.json        # Lockfile for dependencies
├── examples/                # Example scripts and features
│   ├── advanced_mining.js
│   ├── basic_movement_chat.js
│   ├── block_detection_inventory.js
│   ├── building_automation.js
│   ├── chatlog.mjs
│   ├── future_features.md
│   ├── multi_bot_coordination.js
│   └── pathfinding_viewer.js
├── public/                  # Web dashboard files
│   ├── index.html          # Dashboard HTML
│   ├── style.css           # Dashboard styling
│   └── app.js              # Frontend JavaScript
├── recordings/              # Directory for recordings
├── screenshots/             # Directory for screenshots
├── systems/                 # System modules
│   └── movementController.js
└── utils/                   # Utility modules
    ├── botFactory.js       # Individual bot implementation
    ├── botManager.js       # Multi-bot management
    └── loadingBar.js       # Loading bar utility
```

## Key Components

### BotFactory (`utils/botFactory.js`)
- Creates MineFlayer bot instances
- Handles connection, reconnection, and viewer setup
- Manages telemetry data and logging
- Implements basic bot behaviors (chat responses, path tracing)

### BotManager (`utils/botManager.js`)
- Manages multiple bot instances
- Handles bot lifecycle (spawn, kill, status updates)
- Coordinates telemetry and logging across bots
- Provides API for external control

### Web Dashboard (`public/`)
- Real-time interface for bot management
- Socket.IO integration for live updates
- Responsive design with dark theme
- Grid and single viewer modes

## Configuration

### Server Configuration
Edit `server.js` to configure:
- Minecraft server host and port
- Minecraft version
- Viewer base port
- Application port (default: 8080)

### Bot Configuration
Modify `utils/botFactory.js` for:
- Reconnection settings
- Telemetry update intervals
- Viewer options

## API Reference

See `API_REFERENCE.md` for detailed API documentation.

## Development

### Adding New Features
1. Bot behaviors can be extended in `utils/botFactory.js`
2. UI components can be added to `public/index.html` and `public/app.js`
3. New API endpoints can be added to `server.js`

### Testing
Currently, no automated tests are implemented. Manual testing is recommended:
- Test bot spawning and connection
- Verify dashboard functionality
- Check viewer integration
- Test reconnection logic

## Troubleshooting

### Common Issues
1. **Connection Failed**: Ensure Minecraft server is running and accessible
2. **Viewer Not Loading**: Check that Prismarine Viewer ports are available
3. **Socket.IO Errors**: Verify no firewall blocking WebSocket connections
4. **Chat Commands Not Working**: If using client-side mods like "No Chat Report", chat messages may appear as undefined/empty. This mod interferes with chat message processing. Try disabling the mod or using a different client.

### Chat Command Issues
- **Symptom**: Chat commands appear as invisible/undefined in console
- **Cause**: Client-side mods like "No Chat Report" can interfere with chat message processing
- **Solution**:
  - Disable the "No Chat Report" mod
  - Use a vanilla Minecraft client
  - Check console logs for detailed JSON message structure debugging

### Logs
Check the terminal output and dashboard logs for error messages and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - See package.json for details

## Dependencies

- **canvas**: ^3.2.0
- **chalk**: ^5.6.0
- **express**: ^5.1.0
- **mineflayer**: ^4.32.0
- **mineflayer-pathfinder**: ^2.4.5
- **prismarine-viewer**: ^1.33.0
- **readline**: 1.3.0
- **socket.io**: ^4.8.1

## Roadmap

### Planned Features
- **Movement Control**: Full bot movement control from dashboard (walking, jumping, sprinting)
- **Inventory Management**: Access and manage bot inventories remotely
- **Crafting System**: Automated crafting recipes and workbench interaction
- **Auto Mining**: Intelligent mining operations with resource detection
- **Schematic Building**: Load and build structures from schematic files
- **Advanced Pathfinding**: Navigate complex terrain and avoid obstacles

### Future Enhancements
- [ ] Add automated tests
- [ ] Implement bot pathfinding and automation
- [ ] Add more telemetry metrics
- [ ] Support for different Minecraft versions
- [ ] User authentication for dashboard
- [ ] Bot configuration profiles
- [ ] Export/import bot settings

## Disclaimer

This project is for educational and entertainment purposes. Ensure you comply with the Minecraft EULA and server rules when using bots. Use responsibly and respect other players.
