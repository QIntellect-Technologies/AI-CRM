const API_BASE_URL = '/api';

class ApiService {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

const apiService = new ApiService();

export const api = {
  // Leads
  getLeads: () => apiService.get('/leads'),
  addLead: (data: any) => apiService.post('/leads', data),
  updateLead: (id: number, data: any) => apiService.put(`/leads/${id}`, data),

  // Patients
  getPatients: () => apiService.get('/patients'),
  addPatient: (data: any) => apiService.post('/patients', data),
  updatePatient: (id: number, data: any) => apiService.put(`/patients/${id}`, data),

  // Appointments
  getAppointments: () => apiService.get('/appointments'),
  addAppointment: (data: any) => apiService.post('/appointments', data),
  updateAppointment: (id: number, data: any) => apiService.put(`/appointments/${id}`, data),

  // Call Agents
  getCallAgents: () => apiService.get('/call-agents'),
  updateCallAgent: (id: number, data: any) => apiService.put(`/call-agents/${id}`, data),

  // Marketing
  getMarketing: () => apiService.get('/marketing'),
  addMarketing: (data: any) => apiService.post('/marketing', data),

  // AI Insights
  getAIInsights: () => apiService.get('/ai-insights'),

  // Notifications
  getNotifications: () => apiService.get('/notifications'),
  addNotification: (data: any) => apiService.post('/notifications', data),
  markNotificationRead: (id: number) => apiService.put(`/notifications/${id}/read`, {}),

  // Dashboard Stats
  getDashboardStats: () => apiService.get('/dashboard/stats'),

  // Add Branch explicitly if missing
  getBranches: () => apiService.get('/branches'),
  addBranch: (data: any) => apiService.post('/branches', data),
  updateBranch: (id: number, data: any) => apiService.put(`/branches/${id}`, data),

  // Invoices and Billing
  getInvoices: () => apiService.get('/invoices'),
  addInvoice: (data: any) => apiService.post('/invoices', data),
  updateInvoice: (id: number, data: any) => apiService.put(`/invoices/${id}`, data),
  getInvoiceItems: (invoiceId: number) => apiService.get(`/invoices/${invoiceId}/items`),
  addInvoiceItem: (invoiceId: number, data: any) => apiService.post(`/invoices/${invoiceId}/items`, data),

  // AI Predictions
  getAIPredictions: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiService.get(`/ai-predictions${query}`);
  },
  addAIPrediction: (data: any) => apiService.post('/ai-predictions', data),

  // Call Recordings
  getCallRecordings: () => apiService.get('/call-recordings'),
  addCallRecording: (data: any) => apiService.post('/call-recordings', data),

  // Automated Workflows
  getWorkflows: () => apiService.get('/workflows'),
  addWorkflow: (data: any) => apiService.post('/workflows', data),
  updateWorkflow: (id: number, data: any) => apiService.put(`/workflows/${id}`, data),
};

export default api;