FROM node:16-bullseye

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .

# Set to production ONLY AFTER install, so devDependencies (like webpack) are available for the build
ENV NODE_ENV=production
RUN npm run build

# Create uploads folder (required by local provider even if using Azure/AWS later)
RUN mkdir -p public/uploads

EXPOSE 1337

# Run the Strapi process directly (avoiding PM2 inside Docker)
CMD ["npm", "run", "start-prod"]
