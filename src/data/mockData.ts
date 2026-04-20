export type LeadStatus = 'New Lead' | 'Contacted' | 'Appointment Set' | 'Converted' | 'Inactive';
export type LeadSource = 'TikTok' | 'Instagram' | 'Snapchat' | 'Google Ads' | 'Referral';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  aiScore: number; // 0-100
  createdAt: string;
  assignedTo?: string;
  notes?: string;
  lastContact?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  dob: string;
  status: 'Active' | 'Inactive';
  totalVisits: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  doctor: string;
  branch: string;
  status: 'Scheduled' | 'Completed' | 'No-Show' | 'Cancelled';
  type: 'Consultation' | 'Follow-up' | 'Treatment';
  patientHistory?: string;
  doctorNotes?: string;
  specialInstructions?: string;
}

export interface CallAgent {
  id: string;
  name: string;
  status: 'Available' | 'On Call' | 'Wrap-up' | 'Offline';
  callsToday: number;
  avgDuration: string;
  branch: string;
}

export const mockLeads: Lead[] = [
  { id: 'L001', name: 'Mohammed Al-Rashidi', phone: '+971 50 123 4567', source: 'Instagram', status: 'New Lead', aiScore: 92, createdAt: '2026-04-07T08:30:00Z', lastContact: '2h ago' },
  { id: 'L002', name: 'Fatima Al-Zaabi', phone: '+971 55 987 6543', source: 'TikTok', status: 'Contacted', aiScore: 78, createdAt: '2026-04-06T14:15:00Z', assignedTo: 'Sara Ahmed', lastContact: '4h ago' },
  { id: 'L003', name: 'Tariq Saeed', phone: '+971 52 456 7890', source: 'Snapchat', status: 'Appointment Set', aiScore: 85, createdAt: '2026-04-05T09:45:00Z', assignedTo: 'Khalid Hassan', lastContact: '1d ago' },
  { id: 'L004', name: 'Nour Al-Din', phone: '+971 56 321 0987', source: 'Google Ads', status: 'New Lead', aiScore: 45, createdAt: '2026-04-07T10:00:00Z', lastContact: '1h ago' },
  { id: 'L005', name: 'Aisha Rahman', phone: '+971 54 789 0123', source: 'Instagram', status: 'Converted', aiScore: 95, createdAt: '2026-04-01T11:20:00Z', assignedTo: 'Sara Ahmed', lastContact: '2d ago' },
  { id: 'L006', name: 'Zayed Al Mansoori', phone: '+971 50 111 2222', source: 'Referral', status: 'Contacted', aiScore: 60, createdAt: '2026-04-06T10:00:00Z', assignedTo: 'Reem Saleh', lastContact: '5h ago' },
  { id: 'L007', name: 'Layla Ibrahim', phone: '+971 55 333 4444', source: 'TikTok', status: 'Inactive', aiScore: 30, createdAt: '2026-03-20T10:00:00Z', assignedTo: 'Khalid Hassan', lastContact: '14d ago' },
  { id: 'L008', name: 'Omar Khalid', phone: '+971 52 555 6666', source: 'Google Ads', status: 'Appointment Set', aiScore: 88, createdAt: '2026-04-04T10:00:00Z', assignedTo: 'Nour Al-Din', lastContact: '2d ago' },
];

export const mockPatients: Patient[] = [
  { id: 'P001', name: 'Zayed Al Mansoori', phone: '+971 50 111 2222', lastVisit: '2026-02-15', dob: '1985-04-10', status: 'Inactive', totalVisits: 5 },
  { id: 'P002', name: 'Layla Ibrahim', phone: '+971 55 333 4444', lastVisit: '2026-03-20', dob: '1990-08-22', status: 'Active', totalVisits: 2 },
  { id: 'P003', name: 'Tariq Saeed', phone: '+971 52 555 6666', lastVisit: '2026-01-10', dob: '1978-11-05', status: 'Inactive', totalVisits: 8 },
  { id: 'P004', name: 'Nour Al Suwaidi', phone: '+971 56 777 8888', lastVisit: '2026-04-01', dob: '1995-04-08', status: 'Active', totalVisits: 1 },
];

export const mockAppointments: Appointment[] = [
  { 
    id: 'A001', 
    patientName: 'Fatima Hassan', 
    date: '2026-04-08', 
    time: '10:00 AM', 
    doctor: 'Dr. Smith', 
    branch: 'Al Nahda',
    status: 'Scheduled', 
    type: 'Consultation',
    patientHistory: 'No major prior medical conditions. Mild seasonal allergies.',
    doctorNotes: 'Patient complains of frequent headaches. Need to check blood pressure and suggest an eye exam.',
    specialInstructions: 'Please ensure patient brings previous medical records.'
  },
  { 
    id: 'A002', 
    patientName: 'Layla Ibrahim', 
    date: '2026-04-08', 
    time: '11:30 AM', 
    doctor: 'Dr. Jones', 
    branch: 'Deira',
    status: 'Scheduled', 
    type: 'Treatment',
    patientHistory: 'Diagnosed with Type 2 Diabetes in 2024. Currently on Metformin.',
    doctorNotes: 'Routine checkup for diabetes management. Blood sugar levels have been stable.',
    specialInstructions: 'Fasting required for blood tests.'
  },
  { 
    id: 'A003', 
    patientName: 'Nour Al Suwaidi', 
    date: '2026-04-07', 
    time: '09:00 AM', 
    doctor: 'Dr. Smith', 
    branch: 'Jumeirah',
    status: 'Completed', 
    type: 'Follow-up',
    patientHistory: 'Recent surgery for appendicitis (March 2026).',
    doctorNotes: 'Incision is healing well. No signs of infection. Patient can resume normal activities gradually.',
    specialInstructions: 'Schedule another follow-up in 3 months if any pain persists.'
  },
  { 
    id: 'A004', 
    patientName: 'Mohammed Al-Rashidi', 
    date: '2026-04-09', 
    time: '02:00 PM', 
    doctor: 'Dr. Williams', 
    branch: 'Sharjah',
    status: 'Scheduled', 
    type: 'Consultation',
  },
  { 
    id: 'A005', 
    patientName: 'Aisha Rahman', 
    date: '2026-04-10', 
    time: '10:30 AM', 
    doctor: 'Dr. Davis', 
    branch: 'Abu Dhabi',
    status: 'Scheduled', 
    type: 'Treatment',
  },
];

export const mockDoctors = [
  { id: 'D1', name: 'Dr. Smith', specialty: 'General Practice' },
  { id: 'D2', name: 'Dr. Jones', specialty: 'Endocrinology' },
  { id: 'D3', name: 'Dr. Williams', specialty: 'Dermatology' },
  { id: 'D4', name: 'Dr. Brown', specialty: 'Cardiology' },
  { id: 'D5', name: 'Dr. Davis', specialty: 'Pediatrics' },
];

export const mockAgents: CallAgent[] = [
  { id: 'AG1', name: 'Sara Ahmed', status: 'On Call', callsToday: 45, avgDuration: '3m 12s', branch: 'Al Nahda' },
  { id: 'AG2', name: 'Khalid Hassan', status: 'Available', callsToday: 38, avgDuration: '4m 05s', branch: 'Deira' },
  { id: 'AG3', name: 'Nour Al-Din', status: 'Wrap-up', callsToday: 22, avgDuration: '2m 50s', branch: 'Jumeirah' },
  { id: 'AG4', name: 'Reem Saleh', status: 'Offline', callsToday: 0, avgDuration: '0m 00s', branch: 'Sharjah' },
];

export const aiAlerts = [
  { id: 1, type: 'warning', message: '14 leads not contacted in 48h — Auto-follow up suggested', priority: 'High' },
  { id: 2, type: 'insight', message: 'Al Nahda branch conversion dropped 8% — Review call scripts', priority: 'High' },
  { id: 3, type: 'info', message: 'Best call time today: 2PM–5PM based on patient behavior', priority: 'Medium' },
  { id: 4, type: 'action', message: 'High-scoring lead (Mohammed Al-Rashidi, Score: 92) from Instagram needs immediate follow-up.', priority: 'High' },
  { id: 5, type: 'insight', message: 'TikTok campaigns are showing a 25% higher conversion rate this week compared to last week.', priority: 'Medium' },
];

export const systemNotifications = [
  { id: 1, message: 'Patient Ahmed Hassan inactive 32 days — Re-engage now', time: '10m ago', severity: 'red' },
  { id: 2, message: 'TikTok lead batch received: 23 new leads', time: '1h ago', severity: 'green' },
  { id: 3, message: 'Appointment reminder sent to 8 patients', time: '2h ago', severity: 'green' },
  { id: 4, message: 'Call center SLA breached at Deira branch', time: '3h ago', severity: 'red' },
  { id: 5, message: 'AI score updated for 47 leads', time: '5h ago', severity: 'yellow' },
];

export const patientTimeline = [
  { id: 1, patient: 'Mohammed Al-Rashidi', action: 'Appointment Confirmed', time: '10 mins ago', branch: 'Al Nahda', agent: 'Sara Ahmed', status: 'Appointment Confirmed' },
  { id: 2, patient: 'Fatima Al-Zaabi', action: 'Missed Call', time: '1 hour ago', branch: 'Deira', agent: 'Khalid Hassan', status: 'Follow-up Needed' },
  { id: 3, patient: 'Tariq Saeed', action: 'Responded to SMS', time: '2 hours ago', branch: 'Jumeirah', agent: 'System', status: 'Re-engaged' },
  { id: 4, patient: 'Aisha Rahman', action: 'Completed Treatment', time: '3 hours ago', branch: 'Sharjah', agent: 'Dr. Williams', status: 'Converted' },
  { id: 5, patient: 'Omar Khalid', action: 'Booked Consultation', time: '5 hours ago', branch: 'Abu Dhabi', agent: 'Nour Al-Din', status: 'Appointment Confirmed' },
];
