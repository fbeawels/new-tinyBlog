# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built application and required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Skip files that might not exist
RUN if [ -f /app/next.config.js ]; then cp /app/next.config.js ./; fi
RUN if [ -f /app/next-i18next.config.js ]; then cp /app/next-i18next.config.js ./; fi

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
