# Use the official Node.js node:18.13.0-slim image
FROM node:18.13.0-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json ./

# Install pnpm globally
RUN npm install -g pnpm@latest

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the files to the working directory
COPY . .

# Start application
CMD ["pnpm", "run", "start"]

# Expose the port on which the application will run
EXPOSE 8081