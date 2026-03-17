FROM node:20-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git rsync openssh-client

# Copy package files
COPY package*.json ./

# Install all deps (including dev for build)
RUN npm ci

# Copy source
COPY . .

# Build TypeScript → JS bundle
RUN npm run build

# Remove dev deps to reduce image size
RUN npm prune --production

EXPOSE 3000

# Run the compiled bundle
CMD ["node", "dist/index.js"]
