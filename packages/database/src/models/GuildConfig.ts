import { Schema, model } from 'mongoose';
import { IGuildConfigDocument } from '@log7/shared';

const GuildConfigSchema = new Schema<IGuildConfigDocument>(
  {
    guildId: { type: String, required: true, index: true },
    eventCategory: { type: String, required: true },
    logChannelId: { type: String, default: null },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GuildConfigSchema.index({ guildId: 1, eventCategory: 1 }, { unique: true });

export const GuildConfig = model<IGuildConfigDocument>('GuildConfig', GuildConfigSchema);
