# Tests

Test suite for Log7 event logging bot. **166 tests** across 50 test files.

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
│   └── testUtils.ts      # DRY test utilities (TEST_IDS, createTestContext, etc.)
├── unit/                 # Unit tests
│   ├── utils/            # Utility function tests (embed, formatters, diffing)
│   └── database/         # Database service tests (guildConfig, filter, errorLog)
└── events/               # Event handler tests (by category)
    ├── channel/          # 4 tests
    ├── member/           # 6 tests
    ├── message/          # 6 tests
    ├── role/             # 6 tests
    ├── voice/            # 2 tests
    ├── ban/              # 4 tests
    └── ...               # All 19 categories covered
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

# TypeScript validation
pnpm typecheck
```

## Test Coverage

### Event Handler Tests
Each event handler test covers:
1. Log IS sent when event fires and category is enabled
2. Log is NOT sent when category is disabled

### Database Service Tests
- GuildConfigService: get, set, enable, disable, reset
- FilterService: add, remove, shouldLog (whitelist/blacklist)
- ErrorLogService: log, getRecent, getByGuild, markResolved, getStats

### Utility Tests
- Embed creation and formatting
- Formatters (user, channel, timestamp)
- Diffing (object comparison)

## Writing New Tests

Use the DRY test helpers:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TEST_IDS, createTestContext, disableCategory } from '../../helpers/testUtils';
import { GuildConfigService } from '../../../src/database';
import { event } from '../../../src/events/handlers/category/eventName';

describe('eventName', () => {
  beforeEach(async () => {
    await GuildConfigService.set(TEST_IDS.GUILD, 'category', TEST_IDS.LOG_CHANNEL);
  });

  it('sends log when event fires', async () => {
    const { client, logChannel } = createTestContext();
    
    await event.execute(client, mockData);
    
    expect(logChannel.send).toHaveBeenCalled();
  });

  it('does not send log when disabled', async () => {
    await disableCategory('category');
    const { client, logChannel } = createTestContext();
    
    await event.execute(client, mockData);
    
    expect(logChannel.send).not.toHaveBeenCalled();
  });
});
```
