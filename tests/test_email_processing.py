import pytest
from worker.tasks import ingest_email

def test_email_classification():
    """Test email classification into practice areas"""
    email_data = {
        "subject": "Land Purchase Inquiry - Block 45 Plot 123",
        "body": "I am interested in purchasing land in Mbarara...",
        "sender": "client@example.com"
    }
    
    result = ingest_email(email_data)
    
    assert result["classification"] == "Land"
    assert result["confidence"] > 0.8
    assert "Block 45" in str(result["entities"]["properties"])

def test_entity_extraction():
    """Test extraction of parties, amounts, dates"""
    email_body = """
    Dear Lawyer,
    
    I am John Mugisha and I want to purchase land from Mary Kabasinguzi.
    The property is Block 45, Plot 123 in Mbarara.
    The agreed price is UGX 150,000,000.
    We need to complete this by November 30, 2025.
    """
    
    # TODO: Implement entity extraction
    entities = extract_entities(email_body)
    
    assert "John Mugisha" in entities["parties"]
    assert "Mary Kabasinguzi" in entities["parties"]
    assert "Block 45, Plot 123" in str(entities["properties"])
    assert "UGX 150,000,000" in str(entities["amounts"])
    assert "November 30, 2025" in str(entities["deadlines"])

def test_ocr_processing():
    """Test OCR on scanned documents"""
    # TODO: Implement OCR test with sample PDF
    pass

def test_email_summarization():
    """Test AI summarization of email content"""
    # TODO: Implement summarization test
    pass

@pytest.mark.integration
def test_email_to_matter_pipeline():
    """Integration test: email ingestion creates matter"""
    # TODO: Implement full pipeline test
    pass
