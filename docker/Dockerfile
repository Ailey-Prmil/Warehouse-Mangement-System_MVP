# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run your app
CMD ["npm", "run", "dev"]
