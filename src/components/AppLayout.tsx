import React, { useState } from 'react';
import Sidebar from './Sidebar';
import InboxView from './InboxView';
import MattersView from './MattersView';
import RiskReviewsView from './RiskReviewsView';
import DocumentsView from './DocumentsView';
import DashboardView from './DashboardView';

export default function AppLayout() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-auto">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'inbox' && <InboxView />}
        {activeView === 'matters' && <MattersView />}
        {activeView === 'documents' && <DocumentsView />}
        {activeView === 'risk' && <RiskReviewsView />}
      </main>
    </div>
  );
}
