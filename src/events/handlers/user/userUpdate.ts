import { Client, User, PartialUser } from 'discord.js';

// userUpdate is a global event without guild context
// It only logs to console - no guild-specific logging possible
export const event = {
  name: 'userUpdate',
  async execute(_client: Client<true>, oldUser: User | PartialUser, newUser: User) {
    const changes: string[] = [];

    if (oldUser.username !== newUser.username) {
      changes.push(`Username: ${oldUser.username} → ${newUser.username}`);
    }
    if (oldUser.discriminator !== newUser.discriminator) {
      changes.push(`Discriminator: ${oldUser.discriminator} → ${newUser.discriminator}`);
    }
    if (oldUser.avatar !== newUser.avatar) {
      changes.push('Avatar changed');
    }
    if (oldUser.globalName !== newUser.globalName) {
      changes.push(`Display Name: ${oldUser.globalName || 'None'} → ${newUser.globalName || 'None'}`);
    }

    if (changes.length > 0) {
      console.log(`[UserUpdate] ${newUser.tag}: ${changes.join(', ')}`);
    }
  },
};

export default event;
