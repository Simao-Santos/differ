#!/bin/sh
# wait-for-pg.sh

set -e

# TODO: change to environment variables
until PGPASSWORD="postgres" psql -h "postgres" -U "postgres" -c '\q' > /dev/null 2>&1; do
  >&2 echo "Postgres is not yet ready - trying again in 10 seconds"
  sleep 10
done
  
>&2 echo "Postgres is ready - initializing module"
exec "$@"