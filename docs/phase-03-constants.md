# Phase 3: Constants

## Commit: `feat: add constants`

## Files
- `src/constants/index.ts` - Re-exports
- `src/constants/intents.ts` - GatewayIntentBits array
- `src/constants/partials.ts` - Partials array
- `src/constants/colors.ts` - Embed colors per event type
- `src/constants/categories.ts` - Event to category mapping

## Intents needed
Guilds, GuildMembers, GuildModeration, GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks, GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping, MessageContent, GuildScheduledEvents, AutoModerationConfiguration, AutoModerationExecution

## Partials needed
Message, Channel, Reaction, User, GuildMember, GuildScheduledEvent, ThreadMember

## Colors
- Green for create events
- Red for delete events
- Yellow/Orange for update events
- Blue for info events
