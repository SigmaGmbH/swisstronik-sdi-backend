FROM node:18-alpine as ts-environment
WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

ENV NODE_ENV=production
EXPOSE 3000/tcp

COPY . ./


CMD ["npm", "run", "run:esm"]
