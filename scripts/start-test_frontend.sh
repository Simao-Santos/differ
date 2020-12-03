#! /bin/sh

# Creates reports folder and gives permission to EVERYONE
mkdir -p fe/tests/reports
chmod 777 fe/tests/reports

docker-compose -f docker-compose.test_frontend.yml up --exit-code-from frontend
docker-compose down