# Events

Event handling system for Discord.js events.

## Structure

```
events/
├── index.ts         # Event loader
├── base.ts          # Helper functions (getLogChannel, shouldLog, sendLog)
├── createHandler.ts # DRY handler factories with auto error catching
└── handlers/        # 47 event handlers grouped by category
    ├── channel/     # channelCreate, channelDelete, channelUpdate, channelPinsUpdate
    ├── guild/       # guildUpdate, guildIntegrationsUpdate
    ├── member/      # guildMemberAdd, guildMemberRemove, guildMemberUpdate
    ├── message/     # messageDelete, messageUpdate, messageDeleteBulk
    ├── reaction/    # messageReactionAdd/Remove/RemoveAll/RemoveEmoji
    ├── role/        # roleCreate, roleDelete, roleUpdate
    ├── voice/       # voiceStateUpdate
    ├── thread/      # threadCreate, threadDelete, threadUpdate
    ├── emoji/       # emojiCreate, emojiDelete, emojiUpdate
    ├── sticker/     # stickerCreate, stickerDelete, stickerUpdate
    ├── invite/      # inviteCreate, inviteDelete
    ├── scheduled/   # guildScheduledEvent Create/Delete/Update
    ├── stage/       # stageInstance Create/Delete/Update
    ├── ban/         # guildBanAdd, guildBanRemove
    ├── automod/     # autoModerationRule Create/Delete/Update, ActionExecution
    ├── presence/    # presenceUpdate, typingStart
    ├── user/        # userUpdate
    └── webhook/     # webhookUpdate
```

## Adding a New Event Handler

Use the handler factories for DRY, consistent code with automatic error catching:

### Simple Event (single argument)
```typescript
import { createHandler } from '../../createHandler';
import { Embeds, field, userField } from '../../../utils';

export const event = createHandler<GuildMember>({
  name: 'guildMemberAdd',
  category: 'member',
  getGuild: (member) => member.guild,
  getFilterParams: (member) => ({ userId: member.id }),
  createEmbed: (member) => Embeds.created('Member Joined', {
    fields: [
      userField('Member', member),
      field('Account Created', member.user.createdAt.toISOString()),
    ],
  }),
});

export default event;
```

### Update Event (old/new arguments)
```typescript
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, changesField } from '../../../utils';

export const event = createUpdateHandler<Role>({
  name: 'roleUpdate',
  category: 'role',
  getGuild: (_, role) => role.guild,
  createEmbed: (old, cur) => Embeds.updated('Role Updated', {
    fields: [
      field('Role', `<@&${cur.id}>`),
      changesField([
        { label: 'Name', old: old.name, new: cur.name },
        { label: 'Color', old: old.hexColor, new: cur.hexColor },
      ]),
    ],
  }),
});

export default event;
```

### Dual Argument Event
```typescript
import { createDualArgHandler } from '../../createHandler';

export const event = createDualArgHandler<MessageReaction, User>({
  name: 'messageReactionAdd',
  category: 'reaction',
  skip: (r, u) => !r.message.guild || u.bot,
  getGuild: (r) => r.message.guild,
  getFilterParams: (r, u) => ({ userId: u.id, channelId: r.message.channelId }),
  createEmbed: (r, u) => Embeds.created('Reaction Added', {
    fields: [
      userField('User', u),
      field('Emoji', r.emoji.toString()),
    ],
  }),
});
```

## Features

- **Auto error catching** - All errors are logged to database with context
- **Filter checking** - Whitelist/blacklist automatically applied
- **Guild extraction** - Handles Guild objects and IDs uniformly
- **Type safety** - Full Discord.js types, no `any`
