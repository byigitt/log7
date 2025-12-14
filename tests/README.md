# Tests

Test suite for Log7 event logging bot.

## Structure

```
tests/
├── setup.ts              # Global test setup (MongoDB memory server)
├── mocks/                # Mock objects for Discord.js
│   ├── client.ts         # Mock Discord client
│   ├── channel.ts        # Mock channels
│   ├── guild.ts          # Mock guilds
│   ├── member.ts         # Mock members/users
│   └── message.ts        # Mock messages
├── helpers/
│   └── testUtils.ts      # Test utility functions
├── unit/                 # Unit tests
│   ├── utils/            # Utility function tests
│   └── database/         # Database service tests
└── events/               # Event handler tests (by category)
    ├── channel/
    ├── member/
    ├── message/
    ├── role/
    ├── voice/
    ├── ban/
    └── ...
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run only event tests
pnpm test:events

# Run only unit tests
pnpm test:unit
```

## Test Coverage

Each event handler test covers:
1. Log IS sent when event fires and category is enabled
2. Log is NOT sent when category is disabled
3. Log is NOT sent when target is blacklisted
4. Log IS sent when target is whitelisted
5. Embed contains correct information

## Writing New Tests

Use the mock helpers:

```typescript
import { createMockClient, addMockChannel } from '../mocks/client';
import { createMockTextChannel } from '../mocks/channel';
import { GuildConfigService } from '../../src/database/services';

describe('myEvent', () => {
  beforeEach(async () => {
    await GuildConfigService.set(guildId, 'category', logChannelId);
  });

  it('should send log', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    await event.execute(client, ...args);

    expect(logChannel.send).toHaveBeenCalled();
  });
});
```
