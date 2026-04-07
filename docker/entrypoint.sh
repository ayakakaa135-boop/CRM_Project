#!/bin/bash
set -e

echo "⏳ Waiting for database..."
while ! python -c "
import os
from urllib.parse import urlparse
import psycopg2

database_url = os.environ.get('DATABASE_URL')
host = os.environ.get('DB_HOST')

if database_url and not host:
    parsed = urlparse(database_url)
    psycopg2.connect(
        dbname=(parsed.path or '/crm_db').lstrip('/'),
        user=parsed.username or 'postgres',
        password=parsed.password or 'postgres',
        host=parsed.hostname or 'db',
        port=parsed.port or '5432',
    )
else:
    psycopg2.connect(
        dbname=os.environ.get('DB_NAME', 'crm_db'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', 'postgres'),
        host=host or 'db',
        port=os.environ.get('DB_PORT', '5432'),
    )
" 2>/dev/null; do
    sleep 1
done
echo "✅ Database is ready."

echo "🔄 Running migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

if [ "${COMPILE_TRANSLATIONS:-false}" = "true" ]; then
    echo "🌍 Compiling translations..."
    python manage.py compilemessages --ignore=.venv || true
fi

if [ "${SEED_DEMO_DATA:-true}" = "true" ]; then
    echo "🧪 Seeding demo data..."
    python manage.py seed_demo_data
fi

echo "🚀 Starting application..."
exec "$@"
