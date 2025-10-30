# System Architecture

## Overview

The Legal Operations Agent is a microservices-based system designed for on-premises deployment with complete data sovereignty.

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Traefik Proxy                         │
│                    (HTTPS/Load Balancing)                    │
└────────────┬──────────────────────────────┬─────────────────┘
             │                              │
    ┌────────▼────────┐           ┌────────▼────────┐
    │   Frontend      │           │   API Server    │
    │   (Next.js)     │◄─────────►│   (FastAPI)     │
    │   Port 3000     │           │   Port 8000     │
    └─────────────────┘           └────────┬────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
           ┌────────▼────────┐    ┌───────▼───────┐    ┌────────▼────────┐
           │   PostgreSQL    │    │     Redis     │    │     MinIO       │
           │   + pgvector    │    │   (Queue)     │    │  (S3 Storage)   │
           │   Port 5432     │    │   Port 6379   │    │   Port 9000     │
           └─────────────────┘    └───────┬───────┘    └─────────────────┘
                                           │
                                  ┌────────▼────────┐
                                  │  Celery Worker  │
                                  │  (Background)   │
                                  └────────┬────────┘
                                           │
                                  ┌────────▼────────┐
                                  │  File Watcher   │
                                  │  (Watchdog)     │
                                  └─────────────────┘
```

## Data Flow

### Email Ingestion Pipeline
1. **Polling**: Worker polls IMAP/Gmail/Outlook every 5-15 minutes
2. **Parsing**: Extract text, attachments, metadata
3. **OCR**: Process images/scanned PDFs with Tesseract
4. **Classification**: AI model classifies by practice area (85%+ confidence)
5. **Entity Extraction**: NER for parties, dates, amounts, properties
6. **Matter Creation**: Auto-create or link to existing matter
7. **Storage**: Original email → MinIO, metadata → PostgreSQL
8. **Notification**: Update UI, trigger reply suggestions

### Risk Analysis Pipeline
1. **File Detection**: Watcher detects new/modified file in watched folder
2. **Ingestion**: Read file, determine type (PDF/DOCX/TXT/image)
3. **OCR**: If needed, extract text from scanned documents
4. **Chunking**: Split large documents with overlap (1200 tokens, 200 overlap)
5. **Entity Extraction**: Parse parties, dates, clauses, obligations
6. **Risk Analysis**: Apply 12-category rubric with evidence collection
7. **Grading**: Assign High/Medium/Low based on severity
8. **Report Generation**: Create JSON + Markdown/PDF report
9. **Queue**: Add to reviewer queue for lawyer final conclusion
10. **Audit**: Log all actions with cryptographic hash

### Document Drafting Pipeline
1. **Template Selection**: User selects from 10+ templates
2. **Data Fetch**: Retrieve matter details, parties, properties
3. **Population**: Fill template with firm letterhead, client data
4. **Generation**: Create DOCX using python-docx/docxtpl
5. **PDF Export**: Convert via LibreOffice headless
6. **Storage**: Save to MinIO, link to matter
7. **Notification**: Alert lawyer for review

## Database Schema

### Core Tables
- **users**: Authentication, roles (Partner/Associate/Clerk/Admin)
- **matters**: Central case management
- **parties**: People/entities involved in matters
- **properties**: Land references (block/plot)
- **deadlines**: Time-sensitive obligations
- **emails**: Processed email metadata
- **documents**: File metadata and storage links
- **risk_reports**: Risk analysis results
- **risks**: Individual risk findings
- **embeddings**: Vector representations for RAG
- **audit_log**: Immutable action log

### Relationships
```
matters (1) ──< (N) parties
matters (1) ──< (N) properties
matters (1) ──< (N) deadlines
matters (1) ──< (N) emails
matters (1) ──< (N) documents
documents (1) ──< (N) risk_reports
risk_reports (1) ──< (N) risks
documents (1) ──< (N) embeddings
```

## Security Layers

### 1. Network Security
- Internal Docker network isolation
- Traefik reverse proxy with HTTPS
- No external data egress (except email APIs)

### 2. Authentication & Authorization
- JWT tokens with configurable expiry
- Role-based access control (RBAC)
- Session timeout enforcement

### 3. Data Security
- PostgreSQL data-at-rest encryption
- MinIO encrypted buckets
- Sensitive fields hashed (passwords with bcrypt)

### 4. Audit Trail
- Every action logged to immutable table
- Cryptographic hash chain for tamper detection
- Timestamp, user, IP, action details

## Scalability Considerations

### Horizontal Scaling
- **API**: Add more FastAPI instances behind Traefik
- **Workers**: Scale Celery workers based on queue depth
- **Database**: PostgreSQL read replicas for queries

### Vertical Scaling
- **Database**: Increase PostgreSQL memory for large datasets
- **Workers**: More CPU for OCR/embedding tasks
- **Storage**: Expand MinIO volumes as needed

### Performance Optimization
- Redis caching for frequent queries
- pgvector indexes for fast similarity search
- Celery task prioritization (urgent matters first)
- Batch processing for bulk operations

## Monitoring & Observability

### Metrics (Prometheus)
- API request rates, latency, errors
- Worker queue depth, task duration
- Database connection pool, query times
- Storage usage, file counts

### Logs (Structured JSON)
- Application logs per service
- Access logs from Traefik
- Audit logs from database

### Alerts
- Email ingestion failures
- OCR processing errors
- Disk space warnings
- Database connection issues

## Disaster Recovery

### Backup Strategy
- **Daily**: Full PostgreSQL dump
- **Hourly**: Incremental MinIO snapshots
- **Real-time**: Audit log replication

### Recovery Time Objective (RTO)
- Target: < 4 hours for full system restore

### Recovery Point Objective (RPO)
- Target: < 1 hour data loss maximum

## Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **API**: FastAPI 0.104, Pydantic, SQLAlchemy
- **Workers**: Celery, Redis
- **Database**: PostgreSQL 16 + pgvector
- **Storage**: MinIO (S3-compatible)
- **OCR**: Tesseract 5
- **Document**: python-docx, LibreOffice
- **AI/ML**: sentence-transformers, langchain
- **Proxy**: Traefik 2.10
- **Monitoring**: Prometheus, Grafana
