# Phase 27: Logging Commands

## Commit: `feat(commands): add logging commands`

## Command: /logging

### Subcommands

**setup** `<category> <channel>`
- Set the log channel for an event category
- Options: category (choice), channel (channel)

**disable** `<category>`
- Disable logging for a category
- Options: category (choice)

**whitelist add** `<type> <target> [category]`
- Add to whitelist
- Options: type (user/role/channel/category), target (mentionable/channel), category (optional)

**whitelist remove** `<type> <target> [category]`
- Remove from whitelist

**whitelist list** `[category]`
- Show whitelist entries

**blacklist add** `<type> <target> [category]`
- Add to blacklist

**blacklist remove** `<type> <target> [category]`
- Remove from blacklist

**blacklist list** `[category]`
- Show blacklist entries

**status**
- Show all logging settings for this server

**reset** `[category]`
- Reset settings (all or specific category)

**test** `<event>`
- Send a test log message to verify setup
