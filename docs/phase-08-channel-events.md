# Phase 8: Channel Event Handlers

## Commit: `feat(events): add channel handlers`

## Events
- channelCreate - Guild channel created
- channelDelete - Channel deleted
- channelUpdate - Channel name/topic/permissions changed
- channelPinsUpdate - Message pinned/unpinned

## Handler pattern
1. Check if guild exists (ignore DM channels)
2. Get guild config for 'channel' category
3. Check if enabled and has log channel
4. Check filters (shouldLog)
5. Build embed with relevant info
6. Send to log channel

## Embed info to include
- Channel name, type, ID
- Category (parent) if applicable
- For updates: show what changed (name, topic, permissions, etc.)
- For pins: show channel and timestamp
