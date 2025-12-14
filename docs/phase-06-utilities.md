# Phase 6: Utility Functions

## Commit: `feat: add utility functions`

## Files
- `src/utils/index.ts` - Re-exports
- `src/utils/logger.ts` - Console logging with colors/timestamps
- `src/utils/embed.ts` - EmbedBuilder helpers for consistent styling
- `src/utils/attachment.ts` - Download and re-upload attachments
- `src/utils/filters.ts` - Whitelist/blacklist checking logic
- `src/utils/formatters.ts` - Format users, channels, roles, timestamps
- `src/utils/diffing.ts` - Compare old/new objects for update events

## Key functions

### attachment.ts
- preserveAttachments(attachments[]) - Downloads files and creates AttachmentBuilders so attachments stay in log channel forever

### filters.ts
- shouldLog(guildId, category, params) - Checks whitelist first (must be in), then blacklist (must not be in)

### formatters.ts
- formatUser(user) - Returns mention + tag + ID
- formatChannel(channel) - Returns mention + name + ID
- formatTimestamp(date) - Discord timestamp format

### diffing.ts
- getDiff(oldObj, newObj, keys[]) - Returns changed fields for update events
