# Phase 26: Command System

## Commit: `feat: add command system`

## Files
- `src/commands/index.ts` - Command loader
- `src/commands/deploy.ts` - Script to deploy slash commands to Discord

## Command Loader
- Loads all command files from commands/ subdirectories
- Registers commands in a Collection on the client
- Handles interactionCreate for command execution

## Deploy Script
- Run with `pnpm deploy`
- Registers all slash commands with Discord API
- Can deploy globally or to specific guild for testing
