# Commands

Slash command system.

## Structure

```
commands/
├── index.ts      # Command loader and deployer
├── deploy.ts     # Script to deploy commands to Discord
└── logging/      # Logging command group
    └── index.ts  # /logging command with subcommands
```

## Deploying Commands

```bash
pnpm deploy
```

For guild-specific deployment (faster, for testing):
```bash
GUILD_ID=your_guild_id pnpm deploy
```

## Adding a New Command

1. Create a folder for your command group
2. Create an `index.ts` with a `Command` object:

```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Description'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Hello!');
  },
};

export default command;
```
