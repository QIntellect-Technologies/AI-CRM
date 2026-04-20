const API_BASE_URL = '/api';

class ApiService {
  async get(endpoint: string) {
    try {
      console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      console.log('API response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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
};

export default api;