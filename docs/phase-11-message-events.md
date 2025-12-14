# Phase 11: Message Event Handlers

## Commit: `feat(events): add message handlers`

## Events
- messageDelete - Message deleted
- messageUpdate - Message edited
- messageDeleteBulk - Multiple messages deleted (purge)

## NOT included
- messageCreate - Too spammy, not typically logged

## Important: Attachment handling
When a message with attachments is deleted, we need to:
1. Download the attachment from Discord CDN before it expires
2. Re-upload it to the log channel
3. This preserves evidence even after original is gone

## Embed info
- Author, channel, message ID
- Content (before/after for edits)
- Attachments (re-uploaded)
- For bulk: count and channel
