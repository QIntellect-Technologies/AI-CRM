/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Leads } from './views/Leads';
import { CallCenter } from './views/CallCenter';
import { Patients } from './views/Patients';
import { PatientDetails } from './views/PatientDetails';
import { AIInsights } from './views/AIInsights';
import { Appointments } from './views/Appointments';
import { Marketing } from './views/Marketing';
import { Reports } from './views/Reports';
import { Invoices } from './views/Invoices';
import { Workflows } from './views/Workflows';
import { Settings } from './views/Settings';
import { AgentDetails } from './views/AgentDetails';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAgentId, setSelectedAgentId] = useState<string | number | null>(null);

  const handleNavigateToAgent = (agentId: string | number) => {
    setSelectedAgentId(agentId);
    setCurrentView('agent-details');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'leads':
        return <Leads />;
      case 'appointments':
        return <Appointments />;
      case 'patients':
        return <Patients />;
      case 'callcenter':
        return <CallCenter onAgentSelect={handleNavigateToAgent} />;
      case 'agent-details':
        return <AgentDetails agentId={selectedAgentId} onBack={() => setCurrentView('callcenter')} />;
      case 'ai-insights':
        return <AIInsights />;
      case 'marketing':
        return <Marketing />;
      case 'reports':
        return <Reports />;
      case 'invoices':
        return <Invoices />;
      case 'workflows':
        return <Workflows />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>View "{currentView}" is under construction.</p>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

