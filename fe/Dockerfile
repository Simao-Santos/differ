FROM node:latest

WORKDIR /app/fe

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000

CMD npm run serve