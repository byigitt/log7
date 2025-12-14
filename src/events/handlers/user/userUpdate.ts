import { Client, User, PartialUser } from 'discord.js';
import { EventHandler } from '../../../types';
import { createUpdateEmbed, formatUser, setEmbedAuthor } from '../../../utils';

export const event: EventHandler<'userUpdate'> = {
  name: 'userUpdate',
  async execute(client: Client<true>, oldUser: User | PartialUser, newUser: User) {
    const changes: string[] = [];

    if (oldUser.username !== newUser.username) {
      changes.push(`**Username:** ${oldUser.username} → ${newUser.username}`);
    }
    if (oldUser.discriminator !== newUser.discriminator) {
      changes.push(`**Discriminator:** ${oldUser.discriminator} → ${newUser.discriminator}`);
    }
    if (oldUser.avatar !== newUser.avatar) {
      changes.push(`**Avatar:** Changed`);
    }
    if (oldUser.globalName !== newUser.globalName) {
      changes.push(`**Display Name:** ${oldUser.globalName || 'None'} → ${newUser.globalName || 'None'}`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('User Updated')
      .addFields(
        { name: 'User', value: formatUser(newUser), inline: false },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      )
      .setThumbnail(newUser.displayAvatarURL());

    setEmbedAuthor(embed, newUser);

    // This event is global - we can't log to a specific guild
    // The bot would need to iterate through mutual guilds if needed
    console.log(`[UserUpdate] ${newUser.tag}: ${changes.join(', ')}`);
  },
};

export default event;
