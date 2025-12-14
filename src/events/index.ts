import { Client, Collection } from 'discord.js';
import { EventHandler } from '../types';
import { logger } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

export async function loadEvents(client: Client): Promise<Collection<string, EventHandler>> {
  const events = new Collection<string, EventHandler>();
  const handlersPath = path.join(__dirname, 'handlers');

  if (!fs.existsSync(handlersPath)) {
    logger.warn('No handlers directory found');
    return events;
  }

  const categories = fs.readdirSync(handlersPath);

  for (const category of categories) {
    const categoryPath = path.join(handlersPath, category);
    const stat = fs.statSync(categoryPath);

    if (!stat.isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);

      try {
        const eventModule = await import(filePath);
        const event: EventHandler = eventModule.default || eventModule.event;

        if (!event?.name || !event?.execute) {
          logger.warn(`Invalid event file: ${filePath}`);
          continue;
        }

        events.set(event.name, event);

        if (event.once) {
          client.once(event.name, (...args) => event.execute(client as Client<true>, ...args));
        } else {
          client.on(event.name, (...args) => event.execute(client as Client<true>, ...args));
        }

        logger.debug(`Loaded event: ${event.name}`);
      } catch (error) {
        logger.error(`Failed to load event ${filePath}:`, error);
      }
    }
  }

  logger.success(`Loaded ${events.size} events`);
  return events;
}

export * from './base';
