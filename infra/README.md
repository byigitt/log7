# Infrastructure

Docker configuration for deployment.

## Files

- `Dockerfile` - Multi-stage build for production
- `docker-compose.yml` - Full stack with MongoDB

## Usage with Dokploy

Since you're using Dokploy with Traefik, point to the Dockerfile:

```
Build Path: infra/Dockerfile
Context: . (root)
```

The Dockerfile uses multi-stage builds:
1. **deps** - Install dependencies
2. **builder** - Build TypeScript
3. **runner** - Production image

## Environment Variables

Set these in Dokploy:

```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
MONGODB_URI=mongodb://mongodb:27017/log7
```

## Local Development with Docker

```bash
# Build and run
docker-compose -f infra/docker-compose.yml up -d

# View logs
docker-compose -f infra/docker-compose.yml logs -f bot

# Stop
docker-compose -f infra/docker-compose.yml down
```
