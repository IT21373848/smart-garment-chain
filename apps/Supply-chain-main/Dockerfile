# Use Node.js as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

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
