#!/bin/bash
set -e

echo "=== BUTAGIRA & CO. Legal Operations Agent - Bootstrap ==="

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your credentials before continuing"
    exit 1
fi

# Create required directories
echo "Creating required directories..."
mkdir -p data/watched
mkdir -p data/minio
mkdir -p data/postgres
mkdir -p logs

# Set permissions
chmod -R 755 data/
chmod -R 755 logs/

# Pull Docker images
echo "Pulling Docker images..."
docker compose pull

# Build custom images
echo "Building custom images..."
docker compose build

# Start services
echo "Starting services..."
docker compose up -d

# Wait for database
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
echo "Running database migrations..."
docker compose exec -T db psql -U legal_admin -d legal_ops -f /docker-entrypoint-initdb.d/001_init_schema.sql

# Create MinIO buckets
echo "Creating MinIO buckets..."
docker compose exec -T minio mc alias set local http://localhost:9000 $MINIO_USER $MINIO_PASSWORD
docker compose exec -T minio mc mb local/legal-documents --ignore-existing

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "Services running:"
echo "  - Frontend: http://localhost:3000"
echo "  - API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - MinIO Console: http://localhost:9001"
echo ""
echo "Default login: admin@butagira.co.ug / admin123"
echo "⚠️  CHANGE DEFAULT PASSWORD IN PRODUCTION"
