#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file.tar.gz>"
    exit 1
fi

BACKUP_FILE=$1
RESTORE_DIR="./restore_temp"

echo "=== BUTAGIRA & CO. Legal Operations Agent - Restore ==="
echo "Backup file: $BACKUP_FILE"
echo ""
echo "⚠️  WARNING: This will overwrite existing data!"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Extract backup
echo "Extracting backup..."
mkdir -p $RESTORE_DIR
tar -xzf $BACKUP_FILE -C $RESTORE_DIR

# Stop services
echo "Stopping services..."
docker compose down

# Restore database
echo "Restoring database..."
docker compose up -d db
sleep 5
cat $RESTORE_DIR/backups/db_*.sql | docker compose exec -T db psql -U legal_admin legal_ops

# Restore MinIO
echo "Restoring document storage..."
docker compose up -d minio
sleep 5
docker compose exec -T minio mc mirror $RESTORE_DIR/backups/minio_*/ local/legal-documents

# Restore watched folder
echo "Restoring watched folder..."
rm -rf data/watched
cp -r $RESTORE_DIR/backups/watched_*/ data/watched

# Cleanup
rm -rf $RESTORE_DIR

# Restart all services
echo "Restarting all services..."
docker compose up -d

echo ""
echo "✅ Restore complete!"
echo "All services restarted."
