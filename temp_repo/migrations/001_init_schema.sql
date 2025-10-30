-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and Roles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Partner', 'Associate', 'Clerk', 'Admin')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Matters
CREATE TABLE matters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    client_name VARCHAR(255),
    opponent_name VARCHAR(255),
    practice_area VARCHAR(100) CHECK (practice_area IN ('Land', 'Commercial', 'Tax', 'Family', 'Estate', 'Litigation')),
    stage VARCHAR(100),
    court VARCHAR(255),
    case_number VARCHAR(100),
    monetary_value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id)
);

-- Parties
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT
);

-- Properties (Land References)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    block VARCHAR(50),
    plot VARCHAR(50),
    location VARCHAR(255),
    description TEXT
);

-- Deadlines
CREATE TABLE deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(20) CHECK (priority IN ('High', 'Medium', 'Low')),
    completed BOOLEAN DEFAULT FALSE
);

-- Emails
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id),
    subject VARCHAR(500),
    sender VARCHAR(255),
    recipients TEXT,
    body TEXT,
    summary TEXT,
    classification VARCHAR(100),
    confidence DECIMAL(3,2),
    received_at TIMESTAMP,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id),
    filename VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    summary TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id)
);

-- Risk Reports
CREATE TABLE risk_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id),
    file_id UUID REFERENCES documents(id),
    overall_grade VARCHAR(20) CHECK (overall_grade IN ('High', 'Medium', 'Low')),
    summary TEXT,
    json_payload JSONB,
    lawyer_final_conclusion TEXT,
    final_concluded_by UUID REFERENCES users(id),
    final_concluded_at TIMESTAMP,
    signature_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Findings
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES risk_reports(id) ON DELETE CASCADE,
    matter_id UUID REFERENCES matters(id),
    file_id UUID REFERENCES documents(id),
    category VARCHAR(100),
    severity VARCHAR(20) CHECK (severity IN ('High', 'Medium', 'Low')),
    title VARCHAR(500),
    rationale TEXT,
    evidence_ref TEXT,
    suggestion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Embeddings
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER,
    chunk_text TEXT,
    embedding vector(384),
    page_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log (immutable)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hash VARCHAR(255) NOT NULL
);

-- Indexes
CREATE INDEX idx_matters_practice_area ON matters(practice_area);
CREATE INDEX idx_matters_client ON matters(client_name);
CREATE INDEX idx_emails_matter ON emails(matter_id);
CREATE INDEX idx_documents_matter ON documents(matter_id);
CREATE INDEX idx_risks_severity ON risks(severity);
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION)
INSERT INTO users (email, name, role, password_hash) 
VALUES ('admin@butagira.co.ug', 'System Admin', 'Admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BdqhkKfDe');
