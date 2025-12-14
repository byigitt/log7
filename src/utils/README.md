# Utils

Utility functions used throughout the bot.

## Files

### logger.ts
Console logging with colors and timestamps.

```typescript
logger.info('Message');
logger.success('Message');
logger.warn('Message');
logger.error('Message');
logger.debug('Message'); // Only in development
logger.event('eventName', 'guildName');
```

### embed.ts
EmbedBuilder helpers for consistent styling.

```typescript
createEmbed(color, title, description?)
createCreateEmbed(title, description?)  // Green
createDeleteEmbed(title, description?)  // Red
createUpdateEmbed(title, description?)  // Yellow
createInfoEmbed(title, description?)    // Blue
setEmbedAuthor(embed, user)
setEmbedFooter(embed, text, iconURL?)
```

### attachment.ts
Download and re-upload attachments to preserve them.

```typescript
preserveAttachment(attachment)   // Single attachment
preserveAttachments(attachments) // Collection or array
```

### formatters.ts
Format Discord objects for display.

```typescript
formatUser(user)           // @user (tag | id)
formatUserSimple(user)     // tag (id)
formatChannel(channel)     // #channel (name | id)
formatRole(role)           // @role (name | id)
formatTimestamp(date)      // Discord timestamp
formatRelativeTime(date)   // "2 hours ago"
formatChannelType(type)    // "Text", "Voice", etc.
truncate(str, maxLength)   // Truncate with "..."
```

### diffing.ts
Compare objects to find changes.

```typescript
getDiff(oldObj, newObj, keys[])  // Returns changed fields
formatDiffValue(value)           // Format value for display
```
