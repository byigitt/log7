# Utils

Utility functions used throughout the bot.

## Files

### logger.ts
Console logging with colors and timestamps + database-backed error logging.

```typescript
// Console logging
logger.info('Message');
logger.success('Message');
logger.warn('Message');
logger.error('Message');
logger.debug('Message'); // Only in development
logger.event('eventName', 'guildName');

// Database-backed error logging (async)
await logger.logError(error, { type: 'event', source: 'messageCreate', guildId });
await logger.logWarn(error, { type: 'command', source: 'logging', userId });
await logger.fatal(error, { type: 'system', source: 'main' });
```

### embeds.ts
Embed factory for DRY embed creation.

```typescript
import { Embeds } from '../utils';

Embeds.created('User Joined', { fields: [...] })   // Green
Embeds.deleted('User Left', { fields: [...] })     // Red
Embeds.updated('User Updated', { fields: [...] }) // Yellow
Embeds.info('Voice State', { fields: [...] })      // Blue

// With options
Embeds.created('Title', {
  description: 'Description',
  thumbnail: 'url',
  fields: [field('Name', 'value')],
});
```

### fields.ts
Field helper functions for DRY field creation.

```typescript
import { field, userField, channelField, roleField, timestampField, changesField } from '../utils';

field('Name', value)                    // Basic field
field('Name', value, false)             // Non-inline
userField('Member', user)               // <@id> (tag)
channelField('Channel', channel)        // <#id> (name)
roleField('Role', role)                 // <@&id> (name)
timestampField('Created', date)         // Discord timestamp
diffField('Name', oldVal, newVal)       // "old → new" (if changed)
changesField([{ label, old, new }])     // Multi-field changes
```

### embed.ts (legacy)
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
