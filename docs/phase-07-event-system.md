# Phase 7: Event System

## Commit: `feat: add event system`

## Files
- `src/events/index.ts` - Event loader (loads all handlers from handlers/)
- `src/events/base.ts` - Base event handler helper functions

## Event Loader
- Recursively reads all .ts files from handlers/ subdirectories
- Registers each event with client.on() or client.once()
- Passes client as first argument to all handlers

## Base helpers
- getLogChannel(client, guildId, category) - Gets configured log channel
- createBaseEmbed(color, title) - Creates embed with timestamp and consistent style
- sendLog(channel, embed, attachments?) - Sends log message to channel
