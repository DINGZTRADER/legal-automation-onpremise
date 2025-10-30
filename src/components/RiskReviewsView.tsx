import React, { useState } from 'react';

export default function RiskReviewsView() {
  const [selectedReport, setSelectedReport] = useState<number | null>(1);
  const [finalConclusion, setFinalConclusion] = useState('');

  const reports = [
    {
      id: 1,
      filename: 'Commercial_Supply_Agreement_Draft.pdf',
      matter: 'Supply Contract - Bishop Stuart University',
      grade: 'High',
      created: '2 hours ago',
      summary: 'Commercial supply agreement for catering services with several high-risk clauses requiring immediate attention.',
      findings: [
        {
          category: 'Liability & Remedies',
          severity: 'High',
          title: 'Unlimited liability exposure',
          rationale: 'Contract contains no liability cap for supplier, creating unlimited financial exposure for consequential damages.',
          evidence: 'Page 8, Clause 12.3: "Supplier shall indemnify Client for all losses, damages, costs..."',
          suggestion: 'Add: "...up to a maximum of 2x the annual contract value, excluding liability for death/personal injury."'
        },
        {
          category: 'Term & Termination',
          severity: 'High',
          title: 'No termination for convenience',
          rationale: 'Client can terminate at will with 7 days notice; Supplier has no equivalent right, creating imbalance.',
          evidence: 'Page 5, Clause 8.2: "Client may terminate this Agreement at any time..."',
          suggestion: 'Add mutual termination right with 90 days notice and compensation for work-in-progress.'
        },
        {
          category: 'Commercial/Financial',
          severity: 'Medium',
          title: 'Payment terms heavily favor client',
          rationale: 'Net 90 payment terms with no interest on late payment; 10% retention held for 12 months.',
          evidence: 'Page 3, Clause 4.1: "Payment within 90 days of invoice... 10% retention until..."',
          suggestion: 'Negotiate to Net 45 with 2% monthly interest on overdue amounts; reduce retention to 5%.'
        }
      ]
    },
    {
      id: 2,
      filename: 'Lease_Renewal_Nile_Breweries.docx',
      grade: 'Medium',
      created: '1 day ago',
      matter: 'Commercial Lease - Nile Breweries',
      summary: 'Warehouse lease renewal with moderate risks around rent escalation and maintenance obligations.',
      findings: [
        {
          category: 'Commercial/Financial',
          severity: 'Medium',
          title: 'Uncapped rent escalation',
          rationale: 'Annual rent increase tied to CPI with no maximum cap, could lead to unaffordable increases.',
          evidence: 'Page 2, Clause 3.2: "Rent shall increase annually by the Consumer Price Index..."',
          suggestion: 'Add cap: "...subject to a maximum increase of 8% per annum."'
        }
      ]
    }
  ];

  const selected = reports.find(r => r.id === selectedReport);

  const handleFinalize = () => {
    if (finalConclusion.trim()) {
      alert('Risk report finalized and signed. This would be recorded in the audit log.');
      setFinalConclusion('');
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-96 bg-white border-r border-gray-200 overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Risk Reviews</h2>
          <p className="text-sm text-gray-600">{reports.length} pending reviews</p>
        </div>
        <div>
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedReport === report.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-900 text-sm">{report.filename}</div>
                <span className={`text-xs px-2 py-1 rounded ${
                  report.grade === 'High' ? 'bg-red-100 text-red-700' :
                  report.grade === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {report.grade}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-1">{report.matter}</div>
              <div className="text-xs text-gray-500">{report.created}</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selected.filename}</h1>
                  <p className="text-gray-600">{selected.matter}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                  selected.grade === 'High' ? 'bg-red-100 text-red-700' :
                  selected.grade === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selected.grade} RISK
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Executive Summary</h3>
                <p className="text-sm text-gray-700">{selected.summary}</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900">Risk Findings</h2>
              {selected.findings.map((finding, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">{finding.category}</div>
                      <h3 className="text-lg font-bold text-gray-900">{finding.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      finding.severity === 'High' ? 'bg-red-100 text-red-700' :
                      finding.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {finding.severity}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Why It Matters</div>
                      <p className="text-sm text-gray-700">{finding.rationale}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">Evidence</div>
                      <p className="text-sm text-gray-700 italic">{finding.evidence}</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">Suggested Remedy</div>
                      <p className="text-sm text-gray-700">{finding.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                LAWYER FINAL CONCLUSION - REQUIRED
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                The above analysis is an aid only. The responsible lawyer must record their final conclusion below:
              </p>
              <textarea
                value={finalConclusion}
                onChange={(e) => setFinalConclusion(e.target.value)}
                className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm"
                placeholder="Enter your final legal conclusion and recommended course of action..."
              />
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleFinalize}
                  disabled={!finalConclusion.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Sign & Finalize Report
                </button>
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
