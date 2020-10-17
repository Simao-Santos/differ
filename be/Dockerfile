FROM node:latest

WORKDIR /app/be

COPY package.json package-lock.json ./


RUN npm install

COPY . ./

CMD npm start