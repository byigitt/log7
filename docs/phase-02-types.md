# Phase 2: Type Definitions

## Commit: `feat: add type definitions`

## Files
- `src/types/index.ts` - Re-exports all types
- `src/types/events.ts` - Event handler types
- `src/types/config.ts` - Guild config and filter types
- `src/types/client.ts` - Extended client type

## Types to define

### EventHandler<K>
Generic type for event handlers with name, once flag, and execute function.

### EventCategory
Union type: 'channel' | 'guild' | 'member' | 'message' | 'reaction' | 'role' | 'voice' | 'thread' | 'emoji' | 'sticker' | 'invite' | 'scheduled' | 'stage' | 'ban' | 'automod' | 'presence' | 'user' | 'webhook'

### IGuildConfig
- guildId: string
- eventCategory: EventCategory
- logChannelId: string | null
- enabled: boolean

### IFilter
- guildId: string
- filterType: 'whitelist' | 'blacklist'
- targetType: 'user' | 'role' | 'channel' | 'category'
- targetId: string
- eventCategory: EventCategory | 'all'

### FilterCheckParams
- userId?: string
- channelId?: string
- categoryId?: string | null
- roleIds?: string[]
