# Phase 22: AutoMod Event Handlers

## Commit: `feat(events): add automod handlers`

## Events
- autoModerationActionExecution - AutoMod triggered and took action
- autoModerationRuleCreate - AutoMod rule created
- autoModerationRuleDelete - AutoMod rule deleted
- autoModerationRuleUpdate - AutoMod rule changed

## Embed info
- Rule name, ID
- Trigger type (keyword, spam, mention spam, etc.)
- Action taken (block, alert, timeout)
- For execution: user, content, channel
- For rule changes: what was changed
