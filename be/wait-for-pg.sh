#!/bin/sh
# wait-for-pg.sh

set -e

until PGPASSWORD="${POSTGRES_PASSWORD}" psql -d "${POSTGRES_DB}" -U "${POSTGRES_USER}" -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -c '\q' > /dev/null 2>&1; do
  >&2 echo "Postgres is not yet ready - trying again in 10 seconds"
  sleep 10
done
  
>&2 echo "Postgres is ready - initializing module"
exec "$@"