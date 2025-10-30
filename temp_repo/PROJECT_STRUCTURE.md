# Project Structure

```
legal-ops-agent/
├── api/                          # FastAPI Backend Service
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                   # Main FastAPI application
│   ├── models.py                 # SQLAlchemy models
│   ├── schemas.py                # Pydantic schemas
│   ├── routes/                   # API route handlers
│   │   ├── auth.py
│   │   ├── emails.py
│   │   ├── matters.py
│   │   ├── risk.py
│   │   └── documents.py
│   ├── services/                 # Business logic
│   │   ├── email_processor.py
│   │   ├── entity_extractor.py
│   │   ├── risk_analyzer.py
│   │   └── document_generator.py
│   └── utils/                    # Utilities
│       ├── auth.py
│       ├── database.py
│       └── audit.py
│
├── worker/                       # Celery Background Workers
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── tasks.py                  # Celery task definitions
│   ├── email_connector.py        # IMAP/Gmail/Outlook
│   ├── ocr_processor.py          # Tesseract OCR
│   ├── pdf_parser.py             # PDF text extraction
│   ├── risk_engine.py            # Risk analysis logic
│   └── embedding_service.py      # Vector embeddings
│
├── filewatcher/                  # Watched Folder Monitor
│   ├── Dockerfile
│   └── watcher.py                # Watchdog file monitor
│
├── frontend/                     # Next.js React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout.tsx     # Main layout
│   │   │   ├── Sidebar.tsx       # Navigation
│   │   │   ├── DashboardView.tsx
│   │   │   ├── InboxView.tsx
│   │   │   ├── MattersView.tsx
│   │   │   ├── RiskReviewsView.tsx
│   │   │   └── DocumentsView.tsx
│   │   ├── App.tsx
│   │   └── Index.tsx
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── migrations/                   # Database Migrations
│   ├── 001_init_schema.sql
│   ├── 002_add_indexes.sql
│   └── 003_audit_enhancements.sql
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── USER_GUIDE.md
│   └── templates/
│       ├── risk/
│       │   ├── Report.md         # Risk report template
│       │   ├── Schema.json       # JSON schema
│       │   └── Checklist.md      # Lawyer checklist
│       └── documents/
│           ├── acknowledgment.docx
│           ├── demand_letter.docx
│           ├── retainer.docx
│           ├── land_sale.docx
│           ├── tenancy.docx
│           ├── commercial_contract.docx
│           ├── plaint.docx
│           ├── affidavit.docx
│           └── legal_opinion.docx
│
├── scripts/                      # Utility Scripts
│   ├── bootstrap.sh              # Initial setup
│   ├── backup.sh                 # Backup script
│   ├── restore.sh                # Restore script
│   ├── load_samples.sh           # Load sample data
│   └── export_docs.sh            # Export documents
│
├── tests/                        # Test Suite
│   ├── test_email_processing.py
│   ├── test_risk_analysis.py
│   ├── test_document_drafting.py
│   ├── test_entity_extraction.py
│   └── integration/
│       ├── test_email_to_matter.py
│       └── test_file_to_risk.py
│
├── infra/                        # Infrastructure Config
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── dashboards/
│   └── traefik/
│       └── traefik.yml
│
├── data/                         # Runtime Data (gitignored)
│   ├── watched/                  # Watched folder
│   ├── postgres/                 # Database files
│   └── minio/                    # Object storage
│
├── docker-compose.yml            # Main orchestration
├── .env.example                  # Environment template
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md
├── postman_collection.json
└── LICENSE
```

## Key Components

### API Service (`/api`)
- **Purpose**: RESTful API for all operations
- **Tech**: FastAPI, SQLAlchemy, Pydantic
- **Responsibilities**:
  - Authentication & authorization
  - CRUD operations for matters, emails, documents
  - Risk report retrieval
  - Document drafting triggers
  - Audit logging

### Worker Service (`/worker`)
- **Purpose**: Background job processing
- **Tech**: Celery, Redis, Tesseract, sentence-transformers
- **Responsibilities**:
  - Email polling and ingestion
  - OCR and text extraction
  - Entity extraction (NER)
  - Risk analysis execution
  - Document generation
  - Vector embedding creation

### File Watcher (`/filewatcher`)
- **Purpose**: Monitor watched folder for new documents
- **Tech**: Python watchdog
- **Responsibilities**:
  - Detect file creation/modification
  - Trigger risk analysis jobs
  - Support recursive folder monitoring

### Frontend (`/frontend`)
- **Purpose**: User interface for lawyers
- **Tech**: Next.js, React, Tailwind CSS
- **Views**:
  - Dashboard: Overview and stats
  - Inbox: Email triage and classification
  - Matters: Case management
  - Documents: Template-based drafting
  - Risk Reviews: Document risk analysis

### Database (`migrations/`)
- **Purpose**: Data persistence
- **Tech**: PostgreSQL 16 + pgvector
- **Tables**: users, matters, parties, properties, deadlines, emails, documents, risk_reports, risks, embeddings, audit_log

### Documentation (`/docs`)
- Architecture diagrams
- API reference
- Deployment guides
- Risk analysis templates
- Document templates

### Scripts (`/scripts`)
- System initialization
- Backup/restore automation
- Sample data loading
- Maintenance utilities

## Data Flow

```
Email → Worker (Poll) → OCR/Parse → Classify → Extract → Matter → DB
                                                                  ↓
                                                              Frontend

File → Watcher → Worker (Risk) → OCR → Analyze → Report → DB
                                                            ↓
                                                        Frontend

Template → API → Worker (Draft) → Generate → DOCX/PDF → MinIO
                                                          ↓
                                                      Frontend
```

## Configuration Files

- **docker-compose.yml**: Service orchestration
- **.env**: Environment variables and secrets
- **traefik.yml**: Reverse proxy and HTTPS
- **prometheus.yml**: Metrics collection
- **tailwind.config.js**: UI styling

## Development vs Production

### Development
- Hot reload enabled
- Debug logging
- Sample data included
- Self-signed certificates
- Single worker instance

### Production
- Optimized builds
- Warning-level logging
- Real email integration
- Let's Encrypt certificates
- Scaled workers (4+)
- Daily backups
- Monitoring enabled
