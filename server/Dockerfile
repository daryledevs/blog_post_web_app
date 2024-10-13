# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript files
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Start the Node.js application
CMD ["node", "dist/index.js"]  # Update this path if your output directory is different