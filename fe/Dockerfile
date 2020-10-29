FROM node:latest

WORKDIR /app/fe

COPY package.json package-lock.json ./

RUN npm install

RUN npm install node-sass

COPY . ./

EXPOSE 3000

CMD npm start
