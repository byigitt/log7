# Phase 28: Client and Entry Point

## Commit: `feat: add client and entry point`

## Files
- `src/client.ts` - Extended Discord client class
- `src/index.ts` - Main entry point
- `src/config/config.ts` - Environment config loader

## Extended Client
- Extends Discord.js Client
- Adds commands Collection
- Adds events Collection
- Configures intents and partials

## Entry Point (index.ts)
1. Load environment variables
2. Connect to MongoDB
3. Create client instance
4. Load all events
5. Load all commands
6. Login to Discord

## Config
- DISCORD_TOKEN
- CLIENT_ID
- MONGODB_URI
- Optional: LOG_LEVEL, NODE_ENV
