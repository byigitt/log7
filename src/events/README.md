# Events

Event handling system for Discord.js events.

## Structure

```
events/
├── index.ts      # Event loader
├── base.ts       # Helper functions (getLogChannel, shouldLog, sendLog)
└── handlers/     # Event handlers grouped by category
    ├── channel/
    ├── guild/
    ├── member/
    ├── message/
    ├── reaction/
    ├── role/
    ├── voice/
    ├── thread/
    ├── emoji/
    ├── sticker/
    ├── invite/
    ├── scheduled/
    ├── stage/
    ├── ban/
    ├── automod/
    ├── presence/
    ├── user/
    └── webhook/
```

## Adding a New Event Handler

1. Create a file in the appropriate category folder
2. Export an `EventHandler` object:

```typescript
import { Client } from 'discord.js';
import { EventHandler } from '../../types';
import { getLogChannel, shouldLog, sendLog } from '../base';
import { createInfoEmbed } from '../../utils';

export const event: EventHandler<'eventName'> = {
  name: 'eventName',
  async execute(client: Client<true>, ...args) {
    // Get log channel
    const logChannel = await getLogChannel(client, guildId, 'category');
    if (!logChannel) return;

    // Check filters
    const canLog = await shouldLog(guildId, 'category', { userId, channelId });
    if (!canLog) return;

    // Create and send embed
    const embed = createInfoEmbed('Title');
    await sendLog(logChannel, embed);
  },
};

export default event;
```
