import { EmbedBuilder, APIEmbedField } from 'discord.js';
import { ACTION_COLORS } from '../constants';

export interface EmbedOptions {
  description?: string;
  thumbnail?: string;
  image?: string;
  color?: number;
  fields?: (APIEmbedField | null)[];
  footer?: string;
}

function createBase(color: number, title: string, opts: EmbedOptions = {}): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(opts.color ?? color)
    .setTitle(title)
    .setTimestamp();

  if (opts.description) embed.setDescription(opts.description);
  if (opts.thumbnail) embed.setThumbnail(opts.thumbnail);
  if (opts.image) embed.setImage(opts.image);
  if (opts.footer) embed.setFooter({ text: opts.footer });
  
  if (opts.fields) {
    const validFields = opts.fields.filter((f): f is APIEmbedField => f !== null);
    if (validFields.length > 0) embed.addFields(validFields);
  }

  return embed;
}

export const Embeds = {
  created: (title: string, opts?: EmbedOptions) => 
    createBase(ACTION_COLORS.CREATE, `${title} Created`, opts),

  deleted: (title: string, opts?: EmbedOptions) => 
    createBase(ACTION_COLORS.DELETE, `${title} Deleted`, opts),

  updated: (title: string, opts?: EmbedOptions) => 
    createBase(ACTION_COLORS.UPDATE, `${title} Updated`, opts),

  info: (title: string, opts?: EmbedOptions) => 
    createBase(ACTION_COLORS.INFO, title, opts),

  custom: (color: number, title: string, opts?: EmbedOptions) => 
    createBase(color, title, opts),
};

export type { APIEmbedField };
