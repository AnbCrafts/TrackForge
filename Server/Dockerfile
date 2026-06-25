# Use official lightweight Node.js image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port (Cloud Run sets the PORT env variable automatically)
EXPOSE 9000

# Start the application
CMD ["node", "index.js"]
