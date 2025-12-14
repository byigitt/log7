# Phase 15: Thread Event Handlers

## Commit: `feat(events): add thread handlers`

## Events
- threadCreate - Thread created
- threadDelete - Thread deleted
- threadUpdate - Thread name/archived/locked changed
- threadListSync - Threads synced (when gaining access to channel)
- threadMembersUpdate - Members added/removed from thread

## Embed info
- Thread name, ID, parent channel
- Creator
- For updates: what changed (name, archived, locked, auto_archive_duration)
- For members: who was added/removed
