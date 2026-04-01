FROM strapi/base

ENV NODE_VERSION=16.5.0
ENV NODE_ENV=production
ENV PORT=1337

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
#COPY ./.env.test /usr/src/app/

RUN npm install

COPY . /usr/src/app

RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]
