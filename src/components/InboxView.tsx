import React, { useState } from 'react';

export default function InboxView() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(1);

  const emails = [
    {
      id: 1,
      subject: 'Land Purchase Inquiry - Block 45 Plot 123',
      sender: 'John Mugisha',
      email: 'jmugisha@email.com',
      date: '2 hours ago',
      classification: 'Land',
      confidence: 0.92,
      summary: [
        'Client interested in purchasing land in Mbarara',
        'Property: Block 45, Plot 123',
        'Budget: UGX 150,000,000',
        'Requires title verification and contract drafting',
        'Timeline: Complete within 30 days'
      ],
      entities: {
        parties: ['John Mugisha (Buyer)', 'Unknown Seller'],
        properties: ['Block 45, Plot 123, Mbarara'],
        amounts: ['UGX 150,000,000'],
        deadlines: ['30 days from agreement']
      }
    },
    {
      id: 2,
      subject: 'Commercial Lease Renewal - Nile Breweries',
      sender: 'Sarah Nakato',
      email: 'snakato@nilebreweries.ug',
      date: '5 hours ago',
      classification: 'Commercial',
      confidence: 0.88,
      summary: [
        'Lease renewal for warehouse facility',
        'Current lease expires in 60 days',
        'Requesting rent review and extension',
        'Additional storage space needed',
        'Prefer 5-year term'
      ],
      entities: {
        parties: ['Nile Breweries Ltd (Tenant)', 'Landlord TBD'],
        properties: ['Warehouse, Industrial Area, Mbarara'],
        amounts: ['Current rent: UGX 8,000,000/month'],
        deadlines: ['Lease expiry: 60 days']
      }
    }
  ];

  const selected = emails.find(e => e.id === selectedEmail);

  return (
    <div className="flex h-full">
      <div className="w-96 bg-white border-r border-gray-200 overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Email Inbox</h2>
          <p className="text-sm text-gray-600">{emails.length} unprocessed emails</p>
        </div>
        <div>
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedEmail === email.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-900 text-sm">{email.sender}</div>
                <div className="text-xs text-gray-500">{email.date}</div>
              </div>
              <div className="text-sm text-gray-700 mb-2">{email.subject}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {email.classification}
                </span>
                <span className="text-xs text-gray-500">{Math.round(email.confidence * 100)}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selected.subject}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>From: {selected.sender} ({selected.email})</span>
                <span>•</span>
                <span>{selected.date}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">AI Summary</h3>
              <ul className="space-y-2">
                {selected.summary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Extracted Entities</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Parties</div>
                    {selected.entities.parties.map((p, i) => (
                      <div key={i} className="text-sm text-gray-900">{p}</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Properties</div>
                    {selected.entities.properties.map((p, i) => (
                      <div key={i} className="text-sm text-gray-900">{p}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Key Details</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Amounts</div>
                    {selected.entities.amounts.map((a, i) => (
                      <div key={i} className="text-sm text-gray-900">{a}</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Deadlines</div>
                    {selected.entities.deadlines.map((d, i) => (
                      <div key={i} className="text-sm text-gray-900">{d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Create Matter
              </button>
              <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Draft Reply
              </button>
              <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Generate Documents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
