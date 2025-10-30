# API Documentation

Base URL: `http://localhost:8000` (development)

## Authentication

All endpoints (except `/`) require JWT authentication.

```bash
# Login
POST /api/auth/login
{
  "email": "admin@butagira.co.ug",
  "password": "admin123"
}

# Response
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 86400
}

# Use token in headers
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## Email Endpoints

### Trigger Email Ingestion
```bash
POST /api/email/ingest
```
Manually trigger email polling from configured inbox.

**Response:**
```json
{
  "status": "processing",
  "job_id": "uuid",
  "message": "Email ingestion started"
}
```

### List Emails
```bash
GET /api/emails?page=1&limit=20&classification=Land
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `classification`: Filter by practice area
- `unprocessed`: Show only unprocessed (boolean)

**Response:**
```json
{
  "emails": [
    {
      "id": "uuid",
      "subject": "Land Purchase Inquiry",
      "sender": "client@example.com",
      "received_at": "2025-10-29T12:00:00Z",
      "classification": "Land",
      "confidence": 0.92,
      "summary": ["Key point 1", "Key point 2"],
      "entities": {
        "parties": ["John Doe"],
        "amounts": ["UGX 150,000,000"]
      }
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

### Get Email Details
```bash
GET /api/emails/{email_id}
```

## Matter Endpoints

### Create Matter
```bash
POST /api/matters
{
  "title": "Land Sale - Block 45 Plot 123",
  "client_name": "John Mugisha",
  "opponent_name": "Mary Kabasinguzi",
  "practice_area": "Land",
  "stage": "Contract Drafting",
  "monetary_value": 150000000
}
```

### List Matters
```bash
GET /api/matters?practice_area=Land&stage=Active
```

### Get Matter Details
```bash
GET /api/matters/{matter_id}
```

**Response includes:**
- Matter metadata
- Parties list
- Properties list
- Deadlines
- Linked emails
- Linked documents

### Update Matter
```bash
PATCH /api/matters/{matter_id}
{
  "stage": "Negotiation",
  "notes": "Client agreed to terms"
}
```

## Risk Analysis Endpoints

### Trigger Risk Scan
```bash
POST /api/risk/scan
{
  "file_path": "/data/watched/contract.pdf",
  "matter_id": "uuid",
  "reanalyze": false
}
```

**Response:**
```json
{
  "job_id": "uuid",
  "status": "queued",
  "estimated_time": 120
}
```

### Get Risk Report
```bash
GET /api/risk/report/{file_id}
```

**Response:**
```json
{
  "id": "uuid",
  "filename": "contract.pdf",
  "overall_grade": "High",
  "summary": "Commercial contract with several high-risk clauses...",
  "findings": [
    {
      "category": "Liability & Remedies",
      "severity": "High",
      "title": "Unlimited liability exposure",
      "rationale": "No liability cap specified",
      "evidence": {
        "file_path": "/data/watched/contract.pdf",
        "page_number": 8,
        "section": "Clause 12.3",
        "snippet": "Supplier shall indemnify Client for all losses..."
      },
      "suggestion": "Add liability cap of 2x annual contract value"
    }
  ],
  "entities": {
    "parties": [...],
    "deadlines": [...],
    "financial_terms": [...]
  },
  "created_at": "2025-10-29T14:30:00Z"
}
```

### Finalize Risk Report
```bash
POST /api/risk/finalize
{
  "report_id": "uuid",
  "lawyer_final_conclusion": "After review, recommend negotiating liability cap...",
  "signature": "digital_signature_string"
}
```

**Response:**
```json
{
  "status": "finalized",
  "signature_hash": "sha256_hash",
  "finalized_at": "2025-10-29T15:00:00Z"
}
```

## Document Drafting Endpoints

### List Templates
```bash
GET /api/documents/templates
```

**Response:**
```json
{
  "templates": [
    {
      "id": "acknowledgment",
      "name": "Client Acknowledgment + KYC Request",
      "category": "Client Intake",
      "description": "Initial client response with KYC checklist"
    },
    ...
  ]
}
```

### Draft Document
```bash
POST /api/documents/draft
{
  "template_id": "demand",
  "matter_id": "uuid",
  "instructions": "Include 14-day deadline for payment"
}
```

**Response:**
```json
{
  "document_id": "uuid",
  "status": "generated",
  "docx_url": "/api/documents/download/uuid.docx",
  "pdf_url": "/api/documents/download/uuid.pdf"
}
```

### Download Document
```bash
GET /api/documents/download/{document_id}.{format}
```
Format: `docx` or `pdf`

## Search & RAG Endpoints

### Search Documents
```bash
POST /api/search
{
  "query": "land sale agreements with payment terms",
  "limit": 10,
  "matter_id": "uuid"  // optional
}
```

**Response:**
```json
{
  "results": [
    {
      "document_id": "uuid",
      "filename": "land_sale_template.docx",
      "relevance_score": 0.89,
      "snippet": "Payment terms: 30% deposit, 70% on transfer...",
      "page_number": 3
    }
  ]
}
```

## Audit Endpoints

### Get Audit Log
```bash
GET /api/audit?user_id=uuid&action=create_matter&start_date=2025-10-01
```

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_name": "John Lawyer",
      "action": "create_matter",
      "entity_type": "matter",
      "entity_id": "uuid",
      "details": {...},
      "ip_address": "192.168.1.100",
      "timestamp": "2025-10-29T10:00:00Z",
      "hash": "sha256_hash"
    }
  ]
}
```

## Webhooks (Optional)

Configure webhooks for real-time notifications:

```bash
POST /api/webhooks
{
  "url": "https://your-system.com/webhook",
  "events": ["email_processed", "risk_report_ready", "document_drafted"],
  "secret": "webhook_secret"
}
```

## Rate Limits

- **Email ingestion**: Max 1 request per minute
- **Risk analysis**: Max 10 concurrent jobs
- **Document drafting**: Max 20 per hour per user
- **Search queries**: Max 100 per hour per user

## Error Responses

```json
{
  "error": "ValidationError",
  "message": "Invalid practice area",
  "details": {
    "field": "practice_area",
    "allowed_values": ["Land", "Commercial", "Tax", "Family", "Estate"]
  }
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error
