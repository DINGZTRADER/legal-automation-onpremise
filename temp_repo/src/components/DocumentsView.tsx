import React, { useState } from 'react';

export default function DocumentsView() {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    { id: 'acknowledgment', name: 'Client Acknowledgment + KYC Request', category: 'Client Intake' },
    { id: 'demand', name: 'Demand Letter / Letter of Intention to Sue', category: 'Litigation' },
    { id: 'retainer', name: 'Engagement/Retainer Letter', category: 'Client Intake' },
    { id: 'land_sale', name: 'Land Sale Agreement', category: 'Real Estate' },
    { id: 'tenancy', name: 'Tenancy Agreement', category: 'Real Estate' },
    { id: 'commercial', name: 'Commercial Services/Supply Contract', category: 'Commercial' },
    { id: 'plaint', name: 'Plaint/Defence Outline', category: 'Court Documents' },
    { id: 'affidavit', name: 'Affidavit Skeleton', category: 'Court Documents' },
    { id: 'witness', name: 'Witness Statement Template', category: 'Court Documents' },
    { id: 'opinion', name: 'Legal Opinion Outline', category: 'Advisory' },
  ];

  const recentDrafts = [
    { id: 1, name: 'Demand_Letter_Mugisha_v_Kabasinguzi.docx', template: 'Demand Letter', created: '2 hours ago', status: 'Ready' },
    { id: 2, name: 'Retainer_Agreement_Nile_Breweries.docx', template: 'Retainer Letter', created: '1 day ago', status: 'Approved' },
    { id: 3, name: 'Land_Sale_Block45_Plot123.docx', template: 'Land Sale Agreement', created: '2 days ago', status: 'In Review' },
  ];

  const handleGenerate = () => {
    if (selectedTemplate) {
      alert(`Generating ${templates.find(t => t.id === selectedTemplate)?.name}...\nThis would create a DOCX file with firm letterhead and relevant clauses.`);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Drafting</h1>
        <p className="text-gray-600 mt-2">Generate first-pass legal documents from templates</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Templates</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-xs font-medium text-blue-600 mb-1">{template.category}</div>
                <div className="font-semibold text-gray-900">{template.name}</div>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Document Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matter</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                    <option>Land Sale - Block 45 Plot 123 Mbarara</option>
                    <option>Commercial Lease - Nile Breweries</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Instructions</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
                    placeholder="Enter any specific instructions or details to include..."
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Generate Document (DOCX + PDF)
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Drafts</h2>
          <div className="space-y-3">
            {recentDrafts.map((draft) => (
              <div key={draft.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900 text-sm">{draft.name}</div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    draft.status === 'Ready' ? 'bg-green-100 text-green-700' :
                    draft.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {draft.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">{draft.template}</div>
                <div className="text-xs text-gray-500">{draft.created}</div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Download
                  </button>
                  <button className="text-xs px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2 text-sm">Template Features</h3>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Firm letterhead & contact details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Uganda law placeholders with [CITATION_NEEDED]</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Editable DOCX format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>One-click PDF export</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Lawyer review checklist included</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
