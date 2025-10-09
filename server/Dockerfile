# ========================================
# Backend Docker Image (Node.js 20 Alpine)
# ========================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies + curl for health check
RUN npm ci && apk add --no-cache curl

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

# Health check using curl (better IPv4/IPv6 handling)
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]