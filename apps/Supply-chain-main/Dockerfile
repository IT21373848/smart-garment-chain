# Use Node.js as a parent image
FROM node:20.18.0-alpine

# Set the working directory
WORKDIR /app

# Install Python and build dependencies required for native modules
RUN apk add --no-cache build-base libusb-dev eudev-dev python3 linux-headers g++

# Copy package.json and install dependencies
COPY package.json yarn.lock ./

RUN cat package.json

#install yarn
# RUN npm install -g yarn

RUN yarn install --no-cache

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]

