#!/bin/sh
set -e

# Initialize database if it doesn't exist or is empty
if [ ! -f /app/data/frogstar.db ] || [ ! -s /app/data/frogstar.db ]; then
  echo "Initializing database..."
	npm run drizzle:push
  npm run seed
  echo "Database initialized."
else
  echo "Database already exists, skipping initialization."
fi

# Start the application
exec "$@"