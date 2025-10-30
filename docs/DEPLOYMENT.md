# Production Deployment Guide

## Prerequisites

### Hardware Requirements
- **Minimum**: 4 CPU cores, 8GB RAM, 100GB SSD
- **Recommended**: 8 CPU cores, 16GB RAM, 500GB SSD
- **OS**: Ubuntu 22.04 LTS or RHEL 8+

### Software Requirements
- Docker 24.0+
- Docker Compose 2.20+
- Git
- OpenSSL (for certificate generation)

## Pre-Deployment Checklist

- [ ] Server provisioned with sufficient resources
- [ ] Firewall configured (only necessary ports open)
- [ ] SSL certificate obtained (Let's Encrypt or commercial)
- [ ] Email provider credentials ready (IMAP/Gmail/Outlook)
- [ ] Backup storage configured
- [ ] DNS records configured
- [ ] Security audit completed

## Step-by-Step Deployment

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/butagira-co/legal-ops-agent.git
cd legal-ops-agent
sudo chown -R $USER:$USER .
```

### 3. Configure Environment

```bash
# Copy example environment
cp .env.example .env

# Generate secure secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For ENCRYPTION_KEY

# Edit .env with production values
nano .env
```

**Critical .env values to set:**
```env
# Database
DB_PASSWORD=<strong_password>

# MinIO
MINIO_USER=admin
MINIO_PASSWORD=<strong_password>

# JWT
JWT_SECRET=<generated_secret>

# Email (choose one)
IMAP_HOST=imap.gmail.com
IMAP_USER=legal@butagira.co.ug
IMAP_PASSWORD=<app_password>

# Firm Details
FIRM_NAME=BUTAGIRA & CO. ADVOCATES
FIRM_EMAIL=legal@butagira.co.ug
FIRM_PHONE=+256 XXX XXXXXX

# Watched Folder
WATCHED_FOLDER=/opt/legal-ops-agent/data/watched

# Production Settings
NODE_ENV=production
LOG_LEVEL=warning
```

### 4. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d legal.butagira.co.ug

# Certificates will be in /etc/letsencrypt/live/legal.butagira.co.ug/
```

#### Option B: Self-Signed (Development Only)
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./certs/privkey.pem \
  -out ./certs/fullchain.pem
```

### 5. Configure Traefik for HTTPS

Create `traefik.yml`:
```yaml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@butagira.co.ug
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
```

### 6. Initialize System

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run bootstrap
./scripts/bootstrap.sh
```

### 7. Verify Services

```bash
# Check all services running
docker compose ps

# Check logs
docker compose logs -f

# Test API
curl https://legal.butagira.co.ug/api/health
```

### 8. Create Admin User

```bash
# Access database
docker compose exec db psql -U legal_admin legal_ops

# Create user
INSERT INTO users (email, name, role, password_hash)
VALUES ('partner@butagira.co.ug', 'Senior Partner', 'Partner', 
        crypt('secure_password', gen_salt('bf')));
```

### 9. Configure Email Polling

```bash
# Test email connection
docker compose exec worker python -c "
from worker.email_connector import test_connection
test_connection()
"

# Enable scheduled polling (every 5 minutes)
docker compose exec worker celery -A tasks beat
```

### 10. Setup Backup Cron Job

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/legal-ops-agent/scripts/backup.sh >> /var/log/legal-ops-backup.log 2>&1

# Add weekly off-site sync
0 3 * * 0 rsync -avz /opt/legal-ops-agent/backups/ backup-server:/backups/legal-ops/
```

## Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (redirect to HTTPS)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## Monitoring Setup

### Prometheus & Grafana

```bash
# Access Grafana
# URL: https://legal.butagira.co.ug/grafana
# Default: admin/admin (change immediately)

# Import dashboards
# - Docker Container Metrics
# - PostgreSQL Metrics
# - Celery Worker Metrics
```

### Log Aggregation

```bash
# View logs
docker compose logs -f --tail=100 api
docker compose logs -f --tail=100 worker

# Export logs for analysis
docker compose logs --since 24h > logs_$(date +%Y%m%d).txt
```

## Performance Tuning

### PostgreSQL Optimization

Edit `docker-compose.yml` PostgreSQL service:
```yaml
environment:
  POSTGRES_SHARED_BUFFERS: 2GB
  POSTGRES_EFFECTIVE_CACHE_SIZE: 6GB
  POSTGRES_WORK_MEM: 50MB
  POSTGRES_MAINTENANCE_WORK_MEM: 512MB
```

### Worker Scaling

```bash
# Scale workers based on load
docker compose up -d --scale worker=4
```

### Redis Memory Limit

```yaml
redis:
  command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru
```

## Security Hardening

### 1. Change Default Passwords
```sql
-- Update admin password
UPDATE users 
SET password_hash = crypt('new_secure_password', gen_salt('bf'))
WHERE email = 'admin@butagira.co.ug';
```

### 2. Restrict Database Access
```bash
# Edit postgresql.conf
listen_addresses = 'localhost'
```

### 3. Enable Audit Logging
```env
AUDIT_LOG_RETENTION_DAYS=2555  # 7 years
```

### 4. Regular Updates
```bash
# Weekly security updates
sudo apt update && sudo apt upgrade -y
docker compose pull
docker compose up -d
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker compose logs

# Verify .env file
cat .env | grep -v "^#" | grep -v "^$"

# Check disk space
df -h
```

### Email Not Connecting
```bash
# Test IMAP connection
telnet imap.gmail.com 993

# Check worker logs
docker compose logs worker | grep -i email
```

### High Memory Usage
```bash
# Check resource usage
docker stats

# Restart services
docker compose restart
```

## Maintenance

### Daily Tasks
- Monitor disk space
- Review error logs
- Check backup completion

### Weekly Tasks
- Review audit logs
- Update system packages
- Test backup restoration

### Monthly Tasks
- Security audit
- Performance review
- User access review

## Rollback Procedure

If deployment fails:
```bash
# Stop new version
docker compose down

# Restore from backup
./scripts/restore.sh backups/legal_ops_backup_YYYYMMDD.tar.gz

# Verify restoration
docker compose up -d
curl https://legal.butagira.co.ug/api/health
```

## Support Contacts

- **System Admin**: admin@butagira.co.ug
- **Technical Support**: support@butagira.co.ug
- **Emergency**: +256 XXX XXXXXX
