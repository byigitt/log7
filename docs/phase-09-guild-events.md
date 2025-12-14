# Phase 9: Guild Event Handlers

## Commit: `feat(events): add guild handlers`

## Events
- guildUpdate - Server name/icon/settings changed
- guildIntegrationsUpdate - Integrations changed

## NOT included (bot-related)
- guildCreate - Bot joined server
- guildDelete - Bot left/kicked from server
- guildUnavailable - Server outage

## Embed info
- For guildUpdate: show what changed (name, icon, verification level, etc.)
- For integrations: just notify that integrations were updated
