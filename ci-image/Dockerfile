FROM docker:latest

RUN apk --no-cache add curl
RUN apk add --update npm
RUN apk add docker-compose

RUN docker-compose --version

ADD . /app/

CMD docker-compose up