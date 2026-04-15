# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application code into the working directory
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the built application
RUN npm install -g serve

# Expose port 5000 for the application
EXPOSE 3000

# Define the command to run the application
CMD [ "serve", "-s", "build" ]
