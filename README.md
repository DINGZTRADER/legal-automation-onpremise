# BUTAGIRA & CO. ADVOCATES - Legal Operations Agent

Production-grade, on-premises AI-powered legal operations platform for automated email intake, document analysis, risk assessment, and document drafting.

## Features

### 1. Email Intelligence
- Automated IMAP/Gmail/Outlook integration
- AI-powered classification (Land, Commercial, Tax, Family, Estate)
- Entity extraction (parties, deadlines, amounts, properties)
- Automatic matter creation and linking
- Reply suggestions with next steps

### 2. Matter Management
- Comprehensive matter cards with all case details
- Party and property tracking
- Deadline management with priority levels
- Email and document threading
- Practice area categorization

### 3. Risk Analysis Engine
- Automated document ingestion from watched folder
- OCR for scanned documents
- 12-category risk rubric analysis
- High/Medium/Low risk grading with evidence
- Transparent reasoning with page citations
- Required lawyer final conclusion

### 4. Document Drafting
- 10+ legal document templates
- Firm letterhead and Uganda law context
- DOCX generation with PDF export
- Templates include: acknowledgments, demand letters, retainers, contracts, court documents, opinions

### 5. Security & Audit
- On-premises deployment (no data exfiltration)
- Role-based access (Partner, Associate, Clerk, Admin)
- Immutable audit log with cryptographic hashing
- Encrypted data at rest

## Architecture

```
├── api/              # FastAPI backend
├── worker/           # Celery background jobs
├── filewatcher/      # Watched folder monitor
├── frontend/         # Next.js UI (React + Tailwind)
├── migrations/       # PostgreSQL schema
├── docs/templates/   # Risk report & document templates
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- 8GB+ RAM recommended
- 50GB+ disk space

### Development Setup

1. Clone repository and create environment file:
```bash
cp .env.example .env
# Edit .env with your credentials
```

2. Start services:
```bash
docker compose up -d
```

3. Initialize database:
```bash
docker compose exec api python -m alembic upgrade head
```

4. Access UI:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- MinIO Console: http://localhost:9001

### Production Deployment

1. Update .env with production credentials
2. Configure email provider (IMAP/Gmail/Outlook OAuth)
3. Set WATCHED_FOLDER path
4. Enable HTTPS via Traefik
5. Configure backup schedule

## Email Configuration

### Gmail (OAuth2)
1. Create Google Cloud project
2. Enable Gmail API
3. Create OAuth2 credentials
4. Add credentials to .env

### IMAP (Generic)
```env
IMAP_HOST=imap.example.com
IMAP_PORT=993
IMAP_USER=legal@butagira.co.ug
IMAP_PASSWORD=app_specific_password
```

### Outlook/Microsoft 365
```env
GRAPH_TENANT_ID=your_tenant_id
GRAPH_CLIENT_ID=your_client_id
GRAPH_CLIENT_SECRET=your_secret
```

## Watched Folder Setup

Configure path in .env:
```env
WATCHED_FOLDER=/path/to/watched/folder
```

Organize by matter or client:
```
/watched/
├── matter_001_land_sale/
│   ├── contract_draft.pdf
│   └── title_deed.pdf
├── matter_002_commercial_lease/
│   └── lease_agreement.docx
```

## Risk Analysis Rubric

12 categories analyzed:
- Commercial/Financial
- Scope & Deliverables
- Time (EOT, LDs)
- Liability & Remedies
- Term & Termination
- Compliance/Regulatory (Uganda DPA 2019)
- Property/Land
- Dispute Resolution
- IP & Confidentiality
- Counterparty Risk
- Operational Risk
- Ambiguity/Missing Terms

## API Endpoints

```
POST /api/email/ingest          # Trigger email ingestion
GET  /api/emails                # List processed emails
POST /api/matters               # Create matter
GET  /api/matters               # List matters
POST /api/risk/scan             # Trigger risk analysis
GET  /api/risk/report/{id}      # Get risk report
POST /api/risk/finalize         # Finalize with lawyer conclusion
POST /api/documents/draft       # Generate document
```

## Backup & Restore

### Backup
```bash
./scripts/backup.sh
```

### Restore
```bash
./scripts/restore.sh backup_20251029.tar.gz
```

## Monitoring

- Prometheus metrics: http://localhost:9090
- Grafana dashboards: http://localhost:3001
- Logs: `docker compose logs -f [service]`

## Security Considerations

1. Change default passwords in .env
2. Use strong JWT_SECRET (32+ characters)
3. Enable firewall rules (only internal access)
4. Regular security updates
5. Backup encryption keys securely
6. Audit log retention per firm policy

## Troubleshooting

### Email not ingesting
- Check IMAP credentials
- Verify firewall allows outbound IMAP/993
- Check worker logs: `docker compose logs worker`

### OCR failing
- Ensure Tesseract installed in worker container
- Check file permissions on watched folder
- Verify supported file types (.pdf, .docx, .txt, images)

### Risk analysis not triggering
- Check filewatcher logs
- Verify WATCHED_FOLDER path mounted correctly
- Ensure API accessible from filewatcher container

## Support

For issues, contact system administrator or refer to documentation in `/docs`.

## License

Proprietary - BUTAGIRA & CO. ADVOCATES
