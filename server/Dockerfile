# ========================================
# Backend Docker Image (Node.js 20 Alpine)
# ========================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (dev + prod for nodemon)
RUN npm ci

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]