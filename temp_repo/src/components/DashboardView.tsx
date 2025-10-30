import React from 'react';

export default function DashboardView() {
  const stats = [
    { label: 'Active Matters', value: '47', change: '+3 this week', color: 'blue' },
    { label: 'Pending Reviews', value: '12', change: '8 high risk', color: 'red' },
    { label: 'Unread Emails', value: '23', change: '5 new today', color: 'green' },
    { label: 'Drafts Ready', value: '8', change: 'Awaiting approval', color: 'amber' },
  ];

  const recentMatters = [
    { id: 1, title: 'Land Sale - Block 45 Plot 123 Mbarara', client: 'John Mugisha', area: 'Land', risk: 'Low', updated: '2 hours ago' },
    { id: 2, title: 'Commercial Lease Agreement - Nile Breweries', client: 'Nile Breweries Ltd', area: 'Commercial', risk: 'Medium', updated: '5 hours ago' },
    { id: 3, title: 'Estate Planning - Ankole Diocese', client: 'Ankole Diocese', area: 'Estate', risk: 'Low', updated: '1 day ago' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Legal Operations Dashboard</h1>
        <p className="text-gray-600 mt-2">BUTAGIRA & CO. ADVOCATES - Mbarara, Uganda</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className={`text-xs text-${stat.color}-600 font-medium`}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Matters</h2>
          <div className="space-y-4">
            {recentMatters.map((matter) => (
              <div key={matter.id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div className="font-semibold text-gray-900">{matter.title}</div>
                <div className="text-sm text-gray-600 mt-1">Client: {matter.client}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{matter.area}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    matter.risk === 'High' ? 'bg-red-100 text-red-700' :
                    matter.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>{matter.risk} Risk</span>
                  <span className="text-xs text-gray-500">{matter.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">System Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Email processed successfully</div>
                <div className="text-xs text-gray-500">New inquiry from potential client - 10 min ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Risk analysis completed</div>
                <div className="text-xs text-gray-500">Commercial contract flagged for review - 25 min ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Document drafted</div>
                <div className="text-xs text-gray-500">Demand letter ready for approval - 1 hour ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
