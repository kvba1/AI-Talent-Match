# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install --legacy-peer-deps
# Install the Angular CLI globally
RUN npm install -g @angular/cli

# Install any needed packages

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app
RUN npm run build

# Expose the port the app runs on
EXPOSE 4200

# Serve the Angular app
CMD ["ng", "serve", "--host", "0.0.0.0"]