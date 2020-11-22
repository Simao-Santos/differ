#! /bin/sh

# Creates shots folder and gives permission to EVERYONE
mkdir -p be/src/public/shots
chmod 777 be/src/public/shots

docker-compose up
