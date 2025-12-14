import { EmbedBuilder, User, GuildMember } from 'discord.js';
import { ACTION_COLORS } from '../constants';

export function createEmbed(
  color: number,
  title: string,
  description?: string
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setTimestamp();

  if (description) {
    embed.setDescription(description);
  }

  return embed;
}

export function createCreateEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed(ACTION_COLORS.CREATE, title, description);
}

export function createDeleteEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed(ACTION_COLORS.DELETE, title, description);
}

export function createUpdateEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed(ACTION_COLORS.UPDATE, title, description);
}

export function createInfoEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed(ACTION_COLORS.INFO, title, description);
}

export function setEmbedAuthor(
  embed: EmbedBuilder,
  user: User | GuildMember
): EmbedBuilder {
  const displayUser = user instanceof GuildMember ? user.user : user;
  return embed.setAuthor({
    name: displayUser.tag,
    iconURL: displayUser.displayAvatarURL(),
  });
}

export function setEmbedFooter(
  embed: EmbedBuilder,
  text: string,
  iconURL?: string
): EmbedBuilder {
  return embed.setFooter({ text, iconURL });
}
