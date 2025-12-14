# Phase 19: Scheduled Event Handlers

## Commit: `feat(events): add scheduled event handlers`

## Events
- guildScheduledEventCreate - Scheduled event created
- guildScheduledEventDelete - Scheduled event cancelled
- guildScheduledEventUpdate - Event details changed
- guildScheduledEventUserAdd - User subscribed to event
- guildScheduledEventUserRemove - User unsubscribed from event

## Embed info
- Event name, description
- Start/end time
- Location (channel or external)
- Creator
- For user events: which user subscribed/unsubscribed
