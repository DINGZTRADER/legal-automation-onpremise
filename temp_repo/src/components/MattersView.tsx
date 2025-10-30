import React, { useState } from 'react';

export default function MattersView() {
  const [selectedMatter, setSelectedMatter] = useState<number | null>(null);

  const matters = [
    {
      id: 1,
      title: 'Land Sale - Block 45 Plot 123 Mbarara',
      client: 'John Mugisha',
      opponent: 'Mary Kabasinguzi',
      area: 'Land',
      stage: 'Contract Drafting',
      court: 'N/A',
      caseNo: null,
      value: 150000000,
      deadlines: [
        { title: 'Title verification', date: '2025-11-05', priority: 'High' },
        { title: 'Contract review', date: '2025-11-10', priority: 'Medium' }
      ],
      parties: ['John Mugisha (Buyer)', 'Mary Kabasinguzi (Seller)', 'Bank of Uganda (Financier)'],
      properties: ['Block 45, Plot 123, Mbarara Municipality'],
      emails: 5,
      documents: 8
    },
    {
      id: 2,
      title: 'Commercial Lease - Nile Breweries Warehouse',
      client: 'Nile Breweries Ltd',
      opponent: 'Industrial Properties Ltd',
      area: 'Commercial',
      stage: 'Negotiation',
      court: 'N/A',
      caseNo: null,
      value: 480000000,
      deadlines: [
        { title: 'Lease expiry', date: '2025-12-28', priority: 'High' },
        { title: 'Renewal terms', date: '2025-11-15', priority: 'High' }
      ],
      parties: ['Nile Breweries Ltd (Tenant)', 'Industrial Properties Ltd (Landlord)'],
      properties: ['Warehouse Complex, Industrial Area, Mbarara'],
      emails: 12,
      documents: 15
    }
  ];

  const selected = matters.find(m => m.id === selectedMatter);

  return (
    <div className="flex h-full">
      <div className="w-96 bg-white border-r border-gray-200 overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Active Matters</h2>
          <p className="text-sm text-gray-600">{matters.length} matters</p>
        </div>
        <div>
          {matters.map((matter) => (
            <div
              key={matter.id}
              onClick={() => setSelectedMatter(matter.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedMatter === matter.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="font-semibold text-gray-900 text-sm mb-2">{matter.title}</div>
              <div className="text-xs text-gray-600 mb-2">Client: {matter.client}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{matter.area}</span>
                <span className="text-xs text-gray-500">{matter.stage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {selected.area}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {selected.stage}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Client</div>
                <div className="text-lg font-bold text-gray-900">{selected.client}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Opponent</div>
                <div className="text-lg font-bold text-gray-900">{selected.opponent}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Matter Value</div>
                <div className="text-lg font-bold text-gray-900">
                  UGX {(selected.value / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Parties</h3>
                <div className="space-y-2">
                  {selected.parties.map((party, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{party}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Properties</h3>
                <div className="space-y-2">
                  {selected.properties.map((prop, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{prop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {selected.deadlines.map((deadline, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        deadline.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{deadline.title}</div>
                        <div className="text-xs text-gray-600">{deadline.date}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      deadline.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {deadline.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Draft Document
              </button>
              <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                View Files ({selected.documents})
              </button>
              <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                View Emails ({selected.emails})
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a matter to view details
        </div>
      )}
    </div>
  );
}
