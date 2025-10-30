# User Guide - Legal Operations Agent

## Introduction

Welcome to the BUTAGIRA & CO. ADVOCATES Legal Operations Agent. This system automates routine legal tasks, allowing you to focus on high-value legal work.

## Getting Started

### Logging In

1. Navigate to: `https://legal.butagira.co.ug`
2. Enter your email and password
3. Click "Sign In"

**First-time users**: Contact your system administrator for credentials.

### Dashboard Overview

The dashboard shows:
- **Active Matters**: Current case count
- **Pending Reviews**: Documents awaiting your review
- **Unread Emails**: New client inquiries
- **Drafts Ready**: Documents ready for approval

## Email Management

### How Email Intake Works

1. System polls firm email every 5-15 minutes
2. AI classifies each email by practice area
3. Extracts key information (parties, amounts, dates)
4. Creates summary with 5-8 bullet points
5. Suggests next actions

### Reviewing Emails

1. Click **Email Inbox** in sidebar
2. Select an email from the list
3. Review AI-generated summary
4. Check extracted entities (parties, properties, amounts)
5. Choose action:
   - **Create Matter**: Start new case file
   - **Draft Reply**: Generate response
   - **Generate Documents**: Create legal documents

### Creating a Matter from Email

1. Review email summary
2. Click **Create Matter**
3. Verify auto-filled details:
   - Client name
   - Practice area
   - Key parties
   - Property references
   - Monetary value
4. Add additional information
5. Click **Save**

## Matter Management

### Viewing Matters

1. Click **Matters** in sidebar
2. Browse list of active matters
3. Click a matter to view details

### Matter Card Contents

Each matter shows:
- **Title**: Brief description
- **Client**: Client name and contact
- **Opponent**: Opposing party (if applicable)
- **Practice Area**: Land, Commercial, Tax, Family, or Estate
- **Stage**: Current status (e.g., "Contract Drafting")
- **Parties**: All involved parties
- **Properties**: Land references (Block/Plot)
- **Deadlines**: Upcoming dates with priority
- **Value**: Monetary amount involved
- **Files**: Attached documents count
- **Emails**: Related email threads

### Adding Deadlines

1. Open matter card
2. Click **Add Deadline**
3. Enter:
   - Title (e.g., "Title verification")
   - Date
   - Priority (High/Medium/Low)
4. Click **Save**

System will alert you 3 days before deadline.

## Document Drafting

### Available Templates

1. **Client Intake**
   - Acknowledgment + KYC Request
   - Engagement/Retainer Letter

2. **Litigation**
   - Demand Letter
   - Letter of Intention to Sue

3. **Real Estate**
   - Land Sale Agreement
   - Tenancy Agreement

4. **Commercial**
   - Services/Supply Contract

5. **Court Documents**
   - Plaint/Defence Outline
   - Affidavit Skeleton
   - Witness Statement

6. **Advisory**
   - Legal Opinion Outline

### Generating a Document

1. Click **Documents** in sidebar
2. Select template
3. Choose associated matter
4. Add specific instructions (optional)
5. Click **Generate Document**
6. Wait 5-10 seconds
7. Download DOCX (editable) or PDF

### Reviewing Generated Documents

**IMPORTANT**: All generated documents are first drafts. You MUST:
- Review all facts for accuracy
- Verify legal citations (marked with [CITATION_NEEDED])
- Confirm client details
- Check dates and amounts
- Ensure tone is appropriate
- Add your professional judgment

### Editing Documents

1. Download DOCX file
2. Open in Microsoft Word or LibreOffice
3. Edit as needed
4. Save final version
5. Upload to matter (if desired)

## Risk Analysis

### How Risk Analysis Works

The system monitors a "Watched Folder" for new documents. When you save a contract or agreement there, the system:

1. Reads the document (OCR if scanned)
2. Extracts key clauses and terms
3. Analyzes 12 risk categories
4. Assigns High/Medium/Low grade
5. Provides evidence (page + clause)
6. Suggests remedies
7. Awaits your final conclusion

### Risk Categories Analyzed

1. **Commercial/Financial**: Payment terms, pricing, retention
2. **Scope & Deliverables**: Clarity of obligations
3. **Time**: Deadlines, extensions, liquidated damages
4. **Liability & Remedies**: Indemnities, caps, exclusions
5. **Term & Termination**: Duration, exit rights
6. **Compliance/Regulatory**: Uganda laws, licensing
7. **Property/Land**: Title, encumbrances, boundaries
8. **Dispute Resolution**: Jurisdiction, arbitration
9. **IP & Confidentiality**: Ownership, protection
10. **Counterparty Risk**: Identity, authority, solvency
11. **Operational Risk**: Dependencies, change control
12. **Ambiguity/Missing**: Undefined terms, gaps

### Reviewing Risk Reports

1. Click **Risk Reviews** in sidebar
2. Select document from list
3. Review overall grade (High/Medium/Low)
4. Read executive summary
5. Examine each finding:
   - Category and severity
   - Why it matters
   - Evidence (with page reference)
   - Suggested remedy

### Adding Your Final Conclusion

**REQUIRED**: You must add your professional conclusion:

1. Scroll to "Lawyer Final Conclusion" section
2. Enter your assessment:
   - Do you agree with AI findings?
   - What additional issues did you identify?
   - What is your recommendation?
   - What actions should client take?
3. Click **Sign & Finalize Report**
4. System records your conclusion with timestamp

**Example Conclusion**:
```
I have reviewed the AI analysis and concur with the High risk grade.
The unlimited liability clause (Clause 12.3) is unacceptable and must
be negotiated. Additionally, I note the absence of force majeure
provisions which is critical given current circumstances. 

RECOMMENDATION: Do not sign this agreement. Return to client with
proposed amendments to Clauses 12.3, 8.2, and add Clause 15
(Force Majeure). Estimated negotiation time: 2-3 weeks.

Reviewed by: Senior Partner
Date: 29 October 2025
```

### Exporting Risk Reports

1. After finalizing, click **Export PDF**
2. Save to client file
3. Share with client or opposing counsel as needed

## Best Practices

### Email Management
- Review AI summaries daily
- Create matters promptly
- Use reply suggestions as starting points (always customize)

### Matter Management
- Keep deadlines updated
- Add notes after client meetings
- Link all related emails and documents

### Document Drafting
- Always review generated documents thoroughly
- Never send AI-generated documents without review
- Customize templates for each client
- Update templates based on feedback

### Risk Analysis
- Place contracts in watched folder promptly
- Review risk reports within 24 hours
- Always add your final conclusion
- Use findings as negotiation points

## Common Tasks

### Task: Respond to New Client Inquiry

1. Go to **Email Inbox**
2. Select inquiry email
3. Review AI summary
4. Click **Create Matter**
5. Verify details, click **Save**
6. Go to **Documents**
7. Select "Acknowledgment + KYC Request"
8. Choose new matter
9. Click **Generate**
10. Review, edit, and send to client

### Task: Review Contract Before Signing

1. Save contract to watched folder: `/data/watched/matter_name/`
2. Wait 2-5 minutes for analysis
3. Go to **Risk Reviews**
4. Select contract
5. Review all findings
6. Check evidence on actual contract
7. Add your final conclusion
8. Export PDF for file
9. Advise client based on findings

### Task: Draft Demand Letter

1. Go to **Matters**
2. Select relevant matter
3. Click **Draft Document**
4. Select "Demand Letter"
5. Add instructions (e.g., "14-day deadline")
6. Generate document
7. Review and edit
8. Print on firm letterhead
9. Send via registered mail

## Troubleshooting

### Email Not Appearing
- Check email was sent to monitored address
- Wait 15 minutes for next poll
- Contact admin if still missing

### Document Generation Failed
- Ensure matter has required details
- Check template is appropriate for matter type
- Try again in a few minutes

### Risk Analysis Not Starting
- Verify file is in watched folder
- Check file format (PDF, DOCX, TXT supported)
- Ensure file is not password-protected
- Check file size (< 50MB)

### Can't Finalize Risk Report
- Ensure "Final Conclusion" field is filled
- Must be at least 50 characters
- Click "Sign & Finalize" button

## Security Reminders

- Never share your password
- Log out when leaving workstation
- All actions are logged for audit
- Sensitive documents are encrypted
- System is on-premises (no cloud)

## Getting Help

- **Technical Issues**: admin@butagira.co.ug
- **Training**: Contact senior partner
- **Feature Requests**: Submit via admin

## Keyboard Shortcuts

- `Ctrl+K`: Quick search
- `Ctrl+N`: New matter
- `Ctrl+D`: Draft document
- `Esc`: Close modal

---

**Remember**: This system assists your legal work but never replaces your professional judgment. Always apply your expertise to AI-generated content.
