# Use Node.js as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install Python and build dependencies required for native modules
RUN apk add --no-cache build-base libusb-dev eudev-dev python3 linux-headers g++

# Copy package.json and install dependencies
COPY ./package.json ./yarn.lock

RUN cat package.json

#install yarn
# RUN npm install -g yarn

RUN yarn install --no-cache

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN yarn build

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]

