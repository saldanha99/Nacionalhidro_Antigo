FROM node:16-bullseye

ENV NODE_ENV=production
ENV PORT=1337

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
# Exclude package-lock if it's causing issues, or use npm install directly
RUN npm install --legacy-peer-deps

COPY . .

# Build the Strapi admin panel
RUN npm run build

EXPOSE 1337

# Run the Strapi process directly (avoiding PM2 inside Docker)
CMD ["npm", "run", "start-prod"]
