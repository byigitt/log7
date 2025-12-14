# Phase 5: Database Services

## Commit: `feat: add database services`

## Files
- `src/database/services/index.ts` - Re-exports
- `src/database/services/guildConfig.ts` - GuildConfig CRUD
- `src/database/services/filter.ts` - Filter CRUD

## GuildConfigService methods
- get(guildId, category) - Get config for guild+category
- set(guildId, category, channelId) - Set log channel
- enable(guildId, category) - Enable logging
- disable(guildId, category) - Disable logging
- getAll(guildId) - Get all configs for a guild
- reset(guildId, category?) - Reset config(s)

## FilterService methods
- add(guildId, filterType, targetType, targetId, category) - Add filter
- remove(guildId, targetType, targetId) - Remove filter
- list(guildId, filterType?, category?) - List filters
- shouldLog(guildId, category, params) - Check if event should be logged
