FROM node:20-alpine

WORKDIR /app

# System deps: git + rsync for site deployments, python3/make/g++ for native npm modules
RUN apk add --no-cache git rsync openssh-client python3 make g++

# Copy full project (bot needs site-builder/, .claude/skills/, blueprints/templates/)
COPY . .

# Install and build the backend bot
WORKDIR /app/backend
RUN npm ci
RUN npm run build
RUN npm prune --production

# Back to project root — this becomes PROJECT_ROOT inside the container
WORKDIR /app

ENV PROJECT_ROOT=/app
ENV PORT=3001

EXPOSE 3001

CMD ["node", "backend/dist/index.js"]
