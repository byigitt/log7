import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { Command, EventCategory } from '../../types';
import { ALL_CATEGORIES } from '../../constants';
import { GuildConfigService, FilterService } from '../../database/services';
import { logger } from '../../utils';

const categoryChoices = ALL_CATEGORIES.map((c) => ({ name: c, value: c }));

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('logging')
    .setDescription('Configure event logging for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('setup')
        .setDescription('Set the log channel for an event category')
        .addStringOption((opt) =>
          opt
            .setName('category')
            .setDescription('The event category to configure')
            .setRequired(true)
            .addChoices(...categoryChoices)
        )
        .addChannelOption((opt) =>
          opt
            .setName('channel')
            .setDescription('The channel to send logs to')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('disable')
        .setDescription('Disable logging for an event category')
        .addStringOption((opt) =>
          opt
            .setName('category')
            .setDescription('The event category to disable')
            .setRequired(true)
            .addChoices(...categoryChoices)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('status')
        .setDescription('View current logging configuration')
    )
    .addSubcommand((sub) =>
      sub
        .setName('reset')
        .setDescription('Reset logging configuration')
        .addStringOption((opt) =>
          opt
            .setName('category')
            .setDescription('The category to reset (leave empty for all)')
            .addChoices(...categoryChoices)
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName('whitelist')
        .setDescription('Manage whitelist')
        .addSubcommand((sub) =>
          sub
            .setName('add')
            .setDescription('Add to whitelist')
            .addStringOption((opt) =>
              opt
                .setName('type')
                .setDescription('Type of target')
                .setRequired(true)
                .addChoices(
                  { name: 'user', value: 'user' },
                  { name: 'role', value: 'role' },
                  { name: 'channel', value: 'channel' },
                  { name: 'category', value: 'category' }
                )
            )
            .addStringOption((opt) =>
              opt.setName('target').setDescription('The target ID').setRequired(true)
            )
            .addStringOption((opt) =>
              opt
                .setName('event_category')
                .setDescription('Event category (leave empty for all)')
                .addChoices(...categoryChoices)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName('remove')
            .setDescription('Remove from whitelist')
            .addStringOption((opt) =>
              opt
                .setName('type')
                .setDescription('Type of target')
                .setRequired(true)
                .addChoices(
                  { name: 'user', value: 'user' },
                  { name: 'role', value: 'role' },
                  { name: 'channel', value: 'channel' },
                  { name: 'category', value: 'category' }
                )
            )
            .addStringOption((opt) =>
              opt.setName('target').setDescription('The target ID').setRequired(true)
            )
            .addStringOption((opt) =>
              opt
                .setName('event_category')
                .setDescription('Event category (leave empty for all)')
                .addChoices(...categoryChoices)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName('list')
            .setDescription('List whitelist entries')
            .addStringOption((opt) =>
              opt
                .setName('event_category')
                .setDescription('Filter by event category')
                .addChoices(...categoryChoices)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName('blacklist')
        .setDescription('Manage blacklist')
        .addSubcommand((sub) =>
          sub
            .setName('add')
            .setDescription('Add to blacklist')
            .addStringOption((opt) =>
              opt
                .setName('type')
                .setDescription('Type of target')
                .setRequired(true)
                .addChoices(
                  { name: 'user', value: 'user' },
                  { name: 'role', value: 'role' },
                  { name: 'channel', value: 'channel' },
                  { name: 'category', value: 'category' }
                )
            )
            .addStringOption((opt) =>
              opt.setName('target').setDescription('The target ID').setRequired(true)
            )
            .addStringOption((opt) =>
              opt
                .setName('event_category')
                .setDescription('Event category (leave empty for all)')
                .addChoices(...categoryChoices)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName('remove')
            .setDescription('Remove from blacklist')
            .addStringOption((opt) =>
              opt
                .setName('type')
                .setDescription('Type of target')
                .setRequired(true)
                .addChoices(
                  { name: 'user', value: 'user' },
                  { name: 'role', value: 'role' },
                  { name: 'channel', value: 'channel' },
                  { name: 'category', value: 'category' }
                )
            )
            .addStringOption((opt) =>
              opt.setName('target').setDescription('The target ID').setRequired(true)
            )
            .addStringOption((opt) =>
              opt
                .setName('event_category')
                .setDescription('Event category (leave empty for all)')
                .addChoices(...categoryChoices)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName('list')
            .setDescription('List blacklist entries')
            .addStringOption((opt) =>
              opt
                .setName('event_category')
                .setDescription('Filter by event category')
                .addChoices(...categoryChoices)
            )
        )
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    const guildId = interaction.guild.id;
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommandGroup === 'whitelist' || subcommandGroup === 'blacklist') {
        await handleFilterCommand(interaction, guildId, subcommandGroup, subcommand);
      } else {
        switch (subcommand) {
          case 'setup':
            await handleSetup(interaction, guildId);
            break;
          case 'disable':
            await handleDisable(interaction, guildId);
            break;
          case 'status':
            await handleStatus(interaction, guildId);
            break;
          case 'reset':
            await handleReset(interaction, guildId);
            break;
        }
      }
    } catch (error) {
      logger.error('Command error:', error);
      const content = 'An error occurred while executing this command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    }
  },
};

async function handleSetup(interaction: ChatInputCommandInteraction, guildId: string) {
  const category = interaction.options.getString('category', true) as EventCategory;
  const channel = interaction.options.getChannel('channel', true);

  await GuildConfigService.set(guildId, category, channel.id);
  await interaction.reply({
    content: `Logging for **${category}** events is now enabled in ${channel}.`,
    ephemeral: true,
  });
}

async function handleDisable(interaction: ChatInputCommandInteraction, guildId: string) {
  const category = interaction.options.getString('category', true) as EventCategory;

  await GuildConfigService.disable(guildId, category);
  await interaction.reply({
    content: `Logging for **${category}** events has been disabled.`,
    ephemeral: true,
  });
}

async function handleStatus(interaction: ChatInputCommandInteraction, guildId: string) {
  const configs = await GuildConfigService.getAll(guildId);

  if (configs.length === 0) {
    await interaction.reply({
      content: 'No logging categories are configured for this server.',
      ephemeral: true,
    });
    return;
  }

  const lines = configs.map((c) => {
    const status = c.enabled ? '✅' : '❌';
    const channel = c.logChannelId ? `<#${c.logChannelId}>` : 'Not set';
    return `${status} **${c.eventCategory}**: ${channel}`;
  });

  await interaction.reply({
    content: `**Logging Configuration**\n\n${lines.join('\n')}`,
    ephemeral: true,
  });
}

async function handleReset(interaction: ChatInputCommandInteraction, guildId: string) {
  const category = interaction.options.getString('category') as EventCategory | null;

  await GuildConfigService.reset(guildId, category || undefined);

  const msg = category
    ? `Logging configuration for **${category}** has been reset.`
    : 'All logging configurations have been reset.';

  await interaction.reply({ content: msg, ephemeral: true });
}

async function handleFilterCommand(
  interaction: ChatInputCommandInteraction,
  guildId: string,
  filterType: 'whitelist' | 'blacklist',
  subcommand: string
) {
  const eventCategoryOption = interaction.options.getString('event_category');
  const eventCategory: EventCategory | 'all' = (eventCategoryOption as EventCategory) || 'all';

  if (subcommand === 'add') {
    const targetType = interaction.options.getString('type', true) as 'user' | 'role' | 'channel' | 'category';
    const targetId = interaction.options.getString('target', true);

    await FilterService.add(guildId, filterType, targetType, targetId, eventCategory);
    await interaction.reply({
      content: `Added ${targetType} \`${targetId}\` to ${filterType} for ${!eventCategoryOption ? 'all categories' : eventCategory}.`,
      ephemeral: true,
    });
  } else if (subcommand === 'remove') {
    const targetType = interaction.options.getString('type', true) as 'user' | 'role' | 'channel' | 'category';
    const targetId = interaction.options.getString('target', true);

    const removed = await FilterService.remove(guildId, targetType, targetId, eventCategory);
    await interaction.reply({
      content: removed
        ? `Removed ${targetType} \`${targetId}\` from ${filterType}.`
        : `Entry not found in ${filterType}.`,
      ephemeral: true,
    });
  } else if (subcommand === 'list') {
    const filters = await FilterService.list(guildId, filterType, eventCategoryOption ? eventCategoryOption as EventCategory : undefined);

    if (filters.length === 0) {
      await interaction.reply({
        content: `No ${filterType} entries found.`,
        ephemeral: true,
      });
      return;
    }

    const lines = filters.map((f) => `• **${f.targetType}**: \`${f.targetId}\` (${f.eventCategory})`);
    await interaction.reply({
      content: `**${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Entries**\n\n${lines.join('\n')}`,
      ephemeral: true,
    });
  }
}

export default command;
