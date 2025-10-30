import pytest
from worker.risk_engine import analyze_risk, grade_risk

def test_liability_risk_detection():
    """Test detection of unlimited liability clauses"""
    contract_text = """
    12.3 Indemnification
    Supplier shall indemnify Client for all losses, damages, costs,
    and expenses arising from this Agreement without limitation.
    """
    
    findings = analyze_risk(contract_text)
    
    liability_findings = [f for f in findings if f["category"] == "Liability & Remedies"]
    assert len(liability_findings) > 0
    assert any("unlimited" in f["title"].lower() for f in liability_findings)
    assert any(f["severity"] == "High" for f in liability_findings)

def test_payment_terms_analysis():
    """Test analysis of payment terms"""
    contract_text = """
    4.1 Payment Terms
    Payment shall be made within 90 days of invoice.
    A retention of 10% shall be held for 12 months.
    """
    
    findings = analyze_risk(contract_text)
    
    payment_findings = [f for f in findings if f["category"] == "Commercial/Financial"]
    assert len(payment_findings) > 0

def test_termination_clause_review():
    """Test review of termination provisions"""
    contract_text = """
    8.2 Termination
    Client may terminate this Agreement at any time with 7 days notice.
    """
    
    findings = analyze_risk(contract_text)
    
    termination_findings = [f for f in findings if f["category"] == "Term & Termination"]
    assert len(termination_findings) > 0
    assert any("imbalance" in f["rationale"].lower() for f in termination_findings)

def test_risk_grading():
    """Test overall risk grade assignment"""
    findings = [
        {"severity": "High", "category": "Liability & Remedies"},
        {"severity": "High", "category": "Term & Termination"},
        {"severity": "Medium", "category": "Commercial/Financial"}
    ]
    
    grade = grade_risk(findings)
    assert grade == "High"  # Multiple high-severity findings

def test_evidence_extraction():
    """Test extraction of evidence with page numbers"""
    # TODO: Implement evidence extraction test with PDF
    pass

@pytest.mark.integration
def test_file_to_risk_report_pipeline():
    """Integration test: file upload triggers complete risk analysis"""
    # TODO: Implement full pipeline test
    pass
