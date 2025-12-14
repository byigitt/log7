# Phase 4: Database Models

## Commit: `feat: add database models`

## Files
- `src/database/index.ts` - MongoDB connection with mongoose
- `src/database/models/index.ts` - Re-exports
- `src/database/models/GuildConfig.ts` - Guild logging settings
- `src/database/models/Filter.ts` - Whitelist/blacklist entries

## GuildConfig Schema
Each guild can have different log channels per event category.
- Compound index on (guildId, eventCategory) for fast lookups
- Unique constraint so each guild has one config per category

## Filter Schema
Stores whitelist/blacklist entries per guild.
- Index on guildId for fast guild-specific queries
- Supports filtering by user, role, channel, or parent category
- Can apply to specific event category or 'all'
