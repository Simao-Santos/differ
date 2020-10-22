#! /bin/sh

# Creates shots folder and gives permission to EVERYONE
mkdir be/shots
chmod 777 be/shots

docker-compose up
