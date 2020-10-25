#! /bin/sh

# Creates shots folder and gives permission to EVERYONE
mkdir -p be/shots
chmod 777 be/shots

docker-compose up
