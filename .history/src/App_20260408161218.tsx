/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
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
import { WorkflowDetails } from './views/WorkflowDetails';
import { Settings } from './views/Settings';
import { AgentDetails } from './views/AgentDetails';
import { BillingDetails } from './views/BillingDetails';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedAgentId, setSelectedAgentId] = useState<string | number | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | number | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | number | null>(null);
  const [selectedBillingPatientId, setSelectedBillingPatientId] = useState<string | number | null>(null);

  // Global Real-Time Synchronization Listener
  useEffect(() => {
    // Only connect if not already connected globally, though useEffect runs once here.
    const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/', { secure: true });
    
    socket.on('connect', () => console.log('Connected to Real-Time CRM Syncer ✅'));
    
    socket.on('db_mutation', (mutationEvent) => {
       console.log('Real-Time Data Change Detected ->', mutationEvent);
       // Dispatch an event so all mounted pages update their numbers secretly!
       window.dispatchEvent(new Event('crm-mutation'));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNavigateToAgent = (agentId: string | number) => {
    setSelectedAgentId(agentId);
    setCurrentView('agent-details');
  };

  const handleNavigateToPatient = (patientId: string | number) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-details');
  };

  const handleNavigateToWorkflow = (workflowId: string | number) => {
    setSelectedWorkflowId(workflowId);
    setCurrentView('workflow-details');
  };

  const handleNavigateToBillingPatient = (patientId: string | number) => {
    setSelectedBillingPatientId(patientId);
    setCurrentView('billing-details');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} selectedBranch={selectedBranch} />;
      case 'leads':
        return <Leads selectedBranch={selectedBranch} />;
      case 'appointments':
        return <Appointments selectedBranch={selectedBranch} />;
      case 'patients':
        return <Patients onPatientSelect={handleNavigateToPatient} selectedBranch={selectedBranch} />;
      case 'patient-details':
        return <PatientDetails patientId={selectedPatientId} onBack={() => setCurrentView('patients')} selectedBranch={selectedBranch} />;
      case 'callcenter':
        return <CallCenter onAgentSelect={handleNavigateToAgent} selectedBranch={selectedBranch} />;
      case 'agent-details':
        return <AgentDetails agentId={selectedAgentId} onBack={() => setCurrentView('callcenter')} selectedBranch={selectedBranch} />;
      case 'ai-insights':
        return <AIInsights selectedBranch={selectedBranch} />;
      case 'marketing':
        return <Marketing selectedBranch={selectedBranch} />;
      case 'reports':
        return <Reports selectedBranch={selectedBranch} />;
      case 'invoices':
        return <Invoices onPatientSelect={handleNavigateToBillingPatient} selectedBranch={selectedBranch} />;
      case 'billing-details':
        return <BillingDetails patientId={selectedBillingPatientId} onBack={() => setCurrentView('invoices')} selectedBranch={selectedBranch} />;
      case 'workflows':
        return <Workflows onWorkflowSelect={handleNavigateToWorkflow} selectedBranch={selectedBranch} />;
      case 'workflow-details':
        return <WorkflowDetails workflowId={selectedWorkflowId} onBack={() => setCurrentView('workflows')} />;
      case 'settings':
        return <Settings selectedBranch={selectedBranch} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>View "{currentView}" is under construction.</p>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}>
      {renderView()}
    </Layout>
  );
}

