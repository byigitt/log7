# Database

MongoDB database layer using Mongoose.

## Structure

```
database/
├── index.ts           # Connection management & exports
├── models/            # Mongoose schemas
│   ├── GuildConfig.ts # Per-guild logging settings
│   ├── Filter.ts      # Whitelist/blacklist entries
│   └── ErrorLog.ts    # Error tracking and logging
└── services/          # CRUD operations
    ├── guildConfig.ts # GuildConfig operations
    ├── filter.ts      # Filter operations
    └── errorLog.ts    # Error logging operations
```

## Models

### GuildConfig
Stores logging channel configuration per guild and event category.

| Field | Type | Description |
|-------|------|-------------|
| guildId | string | Discord guild ID |
| eventCategory | string | Event category (channel, member, etc.) |
| logChannelId | string | Channel ID to send logs |
| enabled | boolean | Whether logging is enabled |

### Filter
Stores whitelist/blacklist entries.

| Field | Type | Description |
|-------|------|-------------|
| guildId | string | Discord guild ID |
| filterType | 'whitelist' \| 'blacklist' | Filter type |
| targetType | 'user' \| 'role' \| 'channel' \| 'category' | What to filter |
| targetId | string | ID of the target |
| eventCategory | string | Category to apply filter (or 'all') |

### ErrorLog
Stores error logs for debugging and monitoring.

| Field | Type | Description |
|-------|------|-------------|
| timestamp | Date | When error occurred |
| level | 'error' \| 'warn' \| 'fatal' | Severity level |
| type | 'event' \| 'command' \| 'database' \| 'system' | Error source type |
| source | string | Event/command name |
| message | string | Error message |
| stack | string? | Stack trace |
| context | object | Guild, user, channel info |
| resolved | boolean | Whether error was addressed |

## Services

### GuildConfigService
- `get(guildId, category)` - Get config
- `set(guildId, category, channelId)` - Set log channel
- `enable(guildId, category)` - Enable logging
- `disable(guildId, category)` - Disable logging
- `getAll(guildId)` - Get all configs for guild
- `reset(guildId, category?)` - Reset config(s)

### FilterService
- `add(...)` - Add filter entry
- `remove(...)` - Remove filter entry
- `list(...)` - List filter entries
- `shouldLog(guildId, category, params)` - Check if event should be logged

### ErrorLogService
- `log(params)` - Log an error to database
- `getRecent(limit?)` - Get recent errors
- `getUnresolved(limit?)` - Get unresolved errors
- `getByGuild(guildId)` - Get errors for a guild
- `getByType(type)` - Get errors by type
- `getBySource(source)` - Get errors by source
- `markResolved(id, resolvedBy?)` - Mark error as resolved
- `markAllResolved(filter)` - Bulk resolve errors
- `getStats()` - Get error statistics
- `deleteOld(days?)` - Delete old error logs
