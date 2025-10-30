#!/bin/bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/legal_ops_backup_$TIMESTAMP.tar.gz"

echo "=== BUTAGIRA & CO. Legal Operations Agent - Backup ==="
echo "Timestamp: $TIMESTAMP"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL database
echo "Backing up database..."
docker compose exec -T db pg_dump -U legal_admin legal_ops > $BACKUP_DIR/db_$TIMESTAMP.sql

# Backup MinIO data
echo "Backing up document storage..."
docker compose exec -T minio mc mirror local/legal-documents $BACKUP_DIR/minio_$TIMESTAMP/

# Backup watched folder
echo "Backing up watched folder..."
cp -r data/watched $BACKUP_DIR/watched_$TIMESTAMP/

# Create compressed archive
echo "Creating compressed archive..."
tar -czf $BACKUP_FILE \
    $BACKUP_DIR/db_$TIMESTAMP.sql \
    $BACKUP_DIR/minio_$TIMESTAMP/ \
    $BACKUP_DIR/watched_$TIMESTAMP/

# Cleanup temporary files
rm -rf $BACKUP_DIR/db_$TIMESTAMP.sql
rm -rf $BACKUP_DIR/minio_$TIMESTAMP/
rm -rf $BACKUP_DIR/watched_$TIMESTAMP/

# Calculate checksum
CHECKSUM=$(sha256sum $BACKUP_FILE | awk '{print $1}')

echo ""
echo "✅ Backup complete!"
echo "File: $BACKUP_FILE"
echo "Size: $(du -h $BACKUP_FILE | cut -f1)"
echo "SHA256: $CHECKSUM"
echo ""
echo "Store this backup securely and off-site."
