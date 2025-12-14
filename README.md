# Log7

A fully customizable Discord event logging bot with multi-guild support.

## Features

- **47 event handlers** across 19 categories
- **Multi-guild support** - each server has independent configuration
- **Attachment preservation** - downloads and re-uploads attachments to preserve them
- **Whitelist/Blacklist** - filter by users, roles, channels, or categories
- **Slash commands** - easy configuration via `/logging` command
- **Error logging** - persistent error tracking with MongoDB
- **DRY architecture** - handler factories and utility helpers for maintainability
- **Full test coverage** - 166 tests across all components

## Event Categories

| Category | Events |
|----------|--------|
| channel | channelCreate, channelDelete, channelUpdate, channelPinsUpdate |
| guild | guildUpdate, guildIntegrationsUpdate |
| member | guildMemberAdd, guildMemberRemove, guildMemberUpdate |
| message | messageDelete, messageUpdate, messageDeleteBulk |
| reaction | messageReactionAdd, messageReactionRemove, messageReactionRemoveAll, messageReactionRemoveEmoji |
| role | roleCreate, roleDelete, roleUpdate |
| voice | voiceStateUpdate |
| thread | threadCreate, threadDelete, threadUpdate |
| emoji | emojiCreate, emojiDelete, emojiUpdate |
| sticker | stickerCreate, stickerDelete, stickerUpdate |
| invite | inviteCreate, inviteDelete |
| scheduled | guildScheduledEventCreate, guildScheduledEventDelete, guildScheduledEventUpdate |
| stage | stageInstanceCreate, stageInstanceDelete, stageInstanceUpdate |
| ban | guildBanAdd, guildBanRemove |
| automod | autoModerationActionExecution, autoModerationRuleCreate, autoModerationRuleDelete, autoModerationRuleUpdate |
| presence | presenceUpdate, typingStart |
| user | userUpdate |
| webhook | webhookUpdate |

## Setup

### Prerequisites

- Node.js 18+
- MongoDB
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
# DISCORD_TOKEN=your_bot_token
# CLIENT_ID=your_client_id
# MONGODB_URI=mongodb://localhost:27017/log7

# Deploy slash commands
pnpm deploy

# Start the bot
pnpm start
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose -f infra/docker-compose.yml up -d
```

## Commands

### `/logging setup <category> <channel>`
Set the log channel for an event category.

### `/logging disable <category>`
Disable logging for a category.

### `/logging status`
View current logging configuration.

### `/logging reset [category]`
Reset configuration (all or specific category).

### `/logging whitelist add <type> <target> [category]`
Add user/role/channel/category to whitelist.

### `/logging whitelist remove <type> <target> [category]`
Remove from whitelist.

### `/logging whitelist list [category]`
List whitelist entries.

### `/logging blacklist add/remove/list`
Same as whitelist but for blacklist.

## Project Structure

```
src/
├── client.ts          # Extended Discord client
├── index.ts           # Entry point
├── config/            # Environment configuration
├── constants/         # Intents, partials, colors, categories
├── database/          # MongoDB models and services
│   ├── models/        # GuildConfig, Filter, ErrorLog
│   └── services/      # CRUD operations + error logging
├── events/            # Event handlers
│   ├── createHandler.ts  # DRY handler factories
│   ├── base.ts        # Core logging functions
│   └── handlers/      # 47 event handlers (19 categories)
├── commands/          # Slash commands
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
    ├── logger.ts      # Console + DB error logging
    ├── embeds.ts      # Embed factory (Embeds.created/deleted/updated/info)
    ├── fields.ts      # Field helpers (field, userField, channelField, etc.)
    └── ...            # formatters, diffing, attachment
```

## Testing

```bash
pnpm test           # Run all 166 tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage
pnpm typecheck      # TypeScript validation
```

## License

MIT
