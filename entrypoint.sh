#!/bin/sh
set -e

# Initialize database if it doesn't exist or is empty
if [ ! -f ../data/frogstar.db ] || [ ! -s ../data/frogstar.db ]; then
  echo "Initializing database..."
	npm run init-build
  echo "Database initialized."
else
  echo "Database already exists, skipping initialization."
  npm init-rebuild
fi

# Start the application
exec "$@"