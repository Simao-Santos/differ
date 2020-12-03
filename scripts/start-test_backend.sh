#! /bin/sh

# Creates shots folder and gives permission to EVERYONE
mkdir -p be/src/public/shots
chmod 777 be/src/public/shots

# Creates reports folder and gives permission to EVERYONE
mkdir -p be/tests/reports
chmod 777 be/tests/reports

docker-compose -f docker-compose.test_backend.yml up --exit-code-from backend
docker-compose down