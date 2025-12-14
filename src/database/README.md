# Database

MongoDB database layer using Mongoose.

## Structure

```
database/
├── index.ts           # Connection management
├── models/            # Mongoose schemas
│   ├── GuildConfig.ts # Per-guild logging settings
│   └── Filter.ts      # Whitelist/blacklist entries
└── services/          # CRUD operations
    ├── guildConfig.ts # GuildConfig operations
    └── filter.ts      # Filter operations
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
