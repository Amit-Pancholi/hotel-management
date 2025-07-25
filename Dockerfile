FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
# CMD ["npm","run","dev"]

