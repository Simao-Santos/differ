#! /bin/sh

# Creates shots folder and gives permission to EVERYONE
mkdir -p be/public/shots
chmod 777 be/public/shots

docker-compose up
