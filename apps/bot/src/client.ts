import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Command, EventHandler } from './types';
import { INTENTS, PARTIALS } from './constants';

export class LogClient extends Client<true> {
  public commands: Collection<string, Command> = new Collection();
  public events: Collection<string, EventHandler> = new Collection();

  constructor() {
    super({
      intents: INTENTS as GatewayIntentBits[],
      partials: PARTIALS as Partials[],
    });
  }
}
