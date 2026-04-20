import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database path
const dbPath = path.join(__dirname, '..', 'database.db');

// Create database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables
db.serialize(() => {
  // Branches table for multi-clinic support
  db.run(`
    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      manager TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Leads table with branch support
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT DEFAULT 'New Lead',
      ai_score INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'Medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      assigned_to TEXT,
      branch_id INTEGER,
      notes TEXT,
      last_contact TEXT,
      follow_up_date DATE,
      conversion_probability REAL DEFAULT 0.0,
      FOREIGN KEY (branch_id) REFERENCES branches (id)
    )
  `);

  // Patients table with branch support
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      last_visit DATE,
      dob DATE,
      status TEXT DEFAULT 'Active',
      total_visits INTEGER DEFAULT 0,
      branch_id INTEGER,
      loyalty_points INTEGER DEFAULT 0,
      last_notification DATE,
      preferred_doctor TEXT,
      medical_notes TEXT,
      FOREIGN KEY (branch_id) REFERENCES branches (id)
    )
  `);

  // Appointments table with enhanced features
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_id INTEGER,
      date DATE NOT NULL,
      time TEXT NOT NULL,
      doctor TEXT NOT NULL,
      branch_id INTEGER,
      status TEXT DEFAULT 'Scheduled',
      type TEXT NOT NULL,
      patient_history TEXT,
      doctor_notes TEXT,
      special_instructions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reminder_sent BOOLEAN DEFAULT 0,
      follow_up_required BOOLEAN DEFAULT 0,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (branch_id) REFERENCES branches (id)
    )
  `);

  // Call Agents table with branch support
  db.run(`
    CREATE TABLE IF NOT EXISTS call_agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'Offline',
      calls_today INTEGER DEFAULT 0,
      avg_duration TEXT DEFAULT '0m 0s',
      branch_id INTEGER,
      skills TEXT, -- JSON array of skills
      performance_score REAL DEFAULT 0.0,
      last_active DATETIME,
      FOREIGN KEY (branch_id) REFERENCES branches (id)
    )
  `);

  // Marketing Campaigns table with enhanced tracking
  db.run(`
    CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      campaign_name TEXT NOT NULL,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      leads INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      ctr REAL DEFAULT 0,
      cpl REAL DEFAULT 0,
      roi REAL DEFAULT 0,
      status TEXT DEFAULT 'Active',
      start_date DATE,
      end_date DATE,
      target_audience TEXT,
      ai_optimization BOOLEAN DEFAULT 0,
      date DATE DEFAULT CURRENT_DATE
    )
  `);

  // Billing/Invoicing tables
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      appointment_id INTEGER,
      invoice_number TEXT UNIQUE,
      amount REAL NOT NULL,
      tax_amount REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Unpaid',
      due_date DATE,
      paid_date DATE,
      payment_method TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (appointment_id) REFERENCES appointments (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      service_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      description TEXT,
      FOREIGN KEY (invoice_id) REFERENCES invoices (id)
    )
  `);

  // Automated Workflows and Notifications
  db.run(`
    CREATE TABLE IF NOT EXISTS automated_workflows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      trigger_type TEXT NOT NULL, -- 'lead_created', 'appointment_scheduled', 'patient_inactive', etc.
      conditions TEXT, -- JSON conditions
      actions TEXT, -- JSON actions (SMS, email, notification, etc.)
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- 'sms', 'email', 'push', 'system'
      recipient_type TEXT NOT NULL, -- 'patient', 'agent', 'admin'
      recipient_id INTEGER,
      recipient_contact TEXT, -- phone or email
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
      priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
      scheduled_at DATETIME,
      sent_at DATETIME,
      workflow_id INTEGER,
      related_entity_type TEXT, -- 'lead', 'appointment', 'patient'
      related_entity_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workflow_id) REFERENCES automated_workflows (id)
    )
  `);

  // AI Analytics and Predictions
  db.run(`
    CREATE TABLE IF NOT EXISTS ai_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prediction_type TEXT NOT NULL, -- 'appointment_demand', 'lead_conversion', 'patient_churn'
      entity_type TEXT NOT NULL, -- 'branch', 'doctor', 'campaign'
      entity_id INTEGER,
      prediction_date DATE NOT NULL,
      predicted_value REAL NOT NULL,
      confidence_score REAL DEFAULT 0.0,
      factors TEXT, -- JSON factors considered
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Quality Assurance and Call Recordings
  db.run(`
    CREATE TABLE IF NOT EXISTS call_recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      call_id TEXT UNIQUE,
      agent_id INTEGER,
      lead_id INTEGER,
      patient_id INTEGER,
      duration INTEGER, -- in seconds
      recording_url TEXT,
      transcription TEXT,
      quality_score REAL DEFAULT 0.0,
      feedback TEXT,
      call_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES call_agents (id),
      FOREIGN KEY (lead_id) REFERENCES leads (id),
      FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
  `);

  console.log('Enhanced database tables created successfully.');
});

// Insert sample data
db.serialize(() => {
  // Insert branches first
  const branches = [
    ['Al Nahda Medical Center', 'Al Nahda, Dubai', '+971 4 331 1234', 'nahda@polyclinic.ae', 'Dr. Ahmed Al-Rashidi'],
    ['Deira Healthcare Clinic', 'Deira, Dubai', '+971 4 332 5678', 'deira@polyclinic.ae', 'Dr. Fatima Al-Zaabi'],
    ['Burjuman Medical Plaza', 'Burjuman, Dubai', '+971 4 333 9012', 'burjuman@polyclinic.ae', 'Dr. Khalid Hassan'],
    ['Jumeirah Wellness Center', 'Jumeirah, Dubai', '+971 4 334 3456', 'jumeirah@polyclinic.ae', 'Dr. Sara Ahmed'],
    ['Dubai Marina Health Hub', 'Dubai Marina, Dubai', '+971 4 335 7890', 'marina@polyclinic.ae', 'Dr. Tariq Saeed']
  ];

  const branchStmt = db.prepare(`
    INSERT OR IGNORE INTO branches (name, location, phone, email, manager)
    VALUES (?, ?, ?, ?, ?)
  `);

  branches.forEach(branch => branchStmt.run(branch));
  branchStmt.finalize();
  // Generate 100+ sample leads with recent dates
  const leadSources = ['Instagram', 'TikTok', 'Snapchat', 'Google Ads', 'Facebook', 'Website'];
  const leadStatuses = ['New Lead', 'Contacted', 'Appointment Set', 'Converted', 'Inactive'];
  const agents = ['Sara Ahmed', 'Khalid Hassan', 'Reem Saleh', 'Nour Al-Din', 'Ahmed Al-Mansoori'];
  const names = [
    'Mohammed Al-Rashidi', 'Fatima Al-Zaabi', 'Tariq Saeed', 'Nour Al-Din', 'Aisha Rahman',
    'Ahmed Al-Mansoori', 'Layla Ibrahim', 'Zayed Al Suwaidi', 'Maryam Al-Hamad', 'Omar Al-Khalidi',
    'Sarah Johnson', 'David Chen', 'Maria Garcia', 'James Wilson', 'Anna Schmidt',
    'Carlos Rodriguez', 'Emma Thompson', 'Lucas Silva', 'Sophie Martin', 'Alexander Petrov',
    'Yuki Tanaka', 'Priya Patel', 'Mohamed Hassan', 'Fatima Ali', 'Ahmed Mohamed',
    'Sara Al-Zahra', 'Khalid Al-Rashid', 'Nadia Al-Farsi', 'Omar Al-Sayed', 'Laila Al-Mahmoud',
    'Hassan Al-Qasimi', 'Amina Al-Hashimi', 'Rashid Al-Maktoum', 'Salma Al-Shamsi', 'Yousef Al-Falasi',
    'Noor Al-Jabri', 'Hamad Al-Suwaidi', 'Maha Al-Zaabi', 'Saif Al-Mazrouei', 'Ayesha Al-Rumaithi',
    'Faisal Al-Hamad', 'Zahra Al-Khalifa', 'Ibrahim Al-Shehhi', 'Amal Al-Mansoori', 'Jasim Al-Rumaihi',
    'Rana Al-Dhaheri', 'Sultan Al-Nuaimi', 'Dana Al-Muhairi', 'Abdullah Al-Tamimi', 'Huda Al-Ghafli'
  ];

  const priorities = ['High', 'Medium', 'Low'];
  const leads = [];
  const today = new Date();
  
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
    const createdDate = new Date(today);
    createdDate.setDate(today.getDate() - daysAgo);
    
    const name = names[Math.floor(Math.random() * names.length)];
    const phone = `+971 ${50 + Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`;
    const source = leadSources[Math.floor(Math.random() * leadSources.length)];
    const status = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
    const aiScore = Math.floor(Math.random() * 100) + 1;
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const assignedTo = agents[Math.floor(Math.random() * agents.length)];
    const branchId = Math.floor(Math.random() * 5) + 1; // 1-5 branches
    const lastContactHours = Math.floor(Math.random() * 168); // Last 7 days in hours
    const lastContact = lastContactHours < 24 ? `${lastContactHours}h ago` : `${Math.floor(lastContactHours/24)}d ago`;
    const followUpDate = status === 'Contacted' ? new Date(today.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
    const conversionProbability = aiScore / 100; // Based on AI score
    
    leads.push([name, phone, source, status, aiScore, priority, createdDate.toISOString().split('T')[0], assignedTo, branchId, lastContact, followUpDate, conversionProbability]);
  }

  const leadStmt = db.prepare(`
    INSERT OR IGNORE INTO leads (name, phone, source, status, ai_score, priority, created_at, assigned_to, branch_id, last_contact, follow_up_date, conversion_probability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  leads.forEach(lead => leadStmt.run(lead));
  leadStmt.finalize();

  // Insert sample patients with recent activity
  const patientNames = [
    'Zayed Al Mansoori', 'Layla Ibrahim', 'Tariq Saeed', 'Nour Al Suwaidi', 'Fatima Hassan',
    'Ahmed Al-Rashidi', 'Sara Al-Zaabi', 'Mohammed Al-Hamad', 'Aisha Al-Khalidi', 'Omar Al-Falasi',
    'Maryam Al-Shamsi', 'Khalid Al-Maktoum', 'Nadia Al-Jabri', 'Hassan Al-Suwaidi', 'Amal Al-Mansoori',
    'Rashid Al-Qasimi', 'Salma Al-Rumaithi', 'Yousef Al-Zaabi', 'Noor Al-Mazrouei', 'Hamad Al-Dhaheri',
    'Maha Al-Nuaimi', 'Saif Al-Muhairi', 'Ayesha Al-Tamimi', 'Faisal Al-Ghafli', 'Zahra Al-Shehhi',
    'Ibrahim Al-Rumaihi', 'Dana Al-Farsi', 'Abdullah Al-Mahmoud', 'Huda Al-Sayed', 'Jasim Al-Hashimi'
  ];

  const patients = [];
  
  for (let i = 0; i < 80; i++) {
    const daysAgo = Math.floor(Math.random() * 60); // Last 60 days
    const lastVisit = new Date(today);
    lastVisit.setDate(today.getDate() - daysAgo);
    
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - (Math.floor(Math.random() * 60) + 18)); // 18-78 years old
    
    const name = patientNames[Math.floor(Math.random() * patientNames.length)];
    const phone = `+971 ${50 + Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`;
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
    const status = Math.random() > 0.3 ? 'Active' : 'Inactive'; // 70% active
    const totalVisits = Math.floor(Math.random() * 20) + 1;
    const branchId = Math.floor(Math.random() * 5) + 1; // 1-5 branches
    const loyaltyPoints = Math.floor(Math.random() * 1000) + totalVisits * 10;
    const lastNotification = status === 'Inactive' ? lastVisit.toISOString().split('T')[0] : null;
    const preferredDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    
    patients.push([name, phone, email, lastVisit.toISOString().split('T')[0], dob.toISOString().split('T')[0], status, totalVisits, branchId, loyaltyPoints, lastNotification, preferredDoctor]);
  }

  const patientStmt = db.prepare(`
    INSERT OR IGNORE INTO patients (name, phone, email, last_visit, dob, status, total_visits, branch_id, loyalty_points, last_notification, preferred_doctor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  patients.forEach(patient => patientStmt.run(patient));
  patientStmt.finalize();

  // Insert sample appointments with recent dates
  const doctors = ['Dr. Smith', 'Dr. Jones', 'Dr. Brown', 'Dr. Wilson', 'Dr. Davis'];
  const branches = ['Al Nahda', 'Deira', 'Burjuman', 'Jumeirah', 'Dubai Marina'];
  const appointmentTypes = ['Consultation', 'Treatment', 'Checkup', 'Follow-up', 'Emergency'];
  const appointmentStatuses = ['Scheduled', 'Completed', 'No-Show', 'Cancelled'];
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const appointments = [];
  
  for (let i = 0; i < 50; i++) {
    const daysOffset = Math.floor(Math.random() * 14) - 7; // +/- 7 days from today
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + daysOffset);
    
    const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
    const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    
    appointments.push([
      patientName, 
      appointmentDate.toISOString().split('T')[0], 
      time, 
      doctor, 
      branch, 
      status, 
      type,
      'Patient medical history notes',
      'Doctor examination notes',
      'Special instructions for appointment'
    ]);
  }

  const apptStmt = db.prepare(`
    INSERT OR IGNORE INTO appointments (patient_name, date, time, doctor, branch, status, type, patient_history, doctor_notes, special_instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  appointments.forEach(appt => apptStmt.run(appt));
  apptStmt.finalize();

  // Insert sample call agents with realistic activity
  const agentStatuses = ['Available', 'On Call', 'Wrap-up', 'Offline'];
  const agentBranches = ['Al Nahda', 'Deira', 'Burjuman', 'Jumeirah'];
  const agentNames = ['Sara Ahmed', 'Khalid Hassan', 'Reem Saleh', 'Nour Al-Din', 'Ahmed Al-Mansoori', 'Fatima Al-Zaabi', 'Tariq Saeed', 'Layla Ibrahim'];

  const generatedAgents = [];
  
  for (let i = 0; i < 12; i++) {
    const name = agentNames[Math.floor(Math.random() * agentNames.length)];
    const status = agentStatuses[Math.floor(Math.random() * agentStatuses.length)];
    const callsToday = status === 'Offline' ? 0 : Math.floor(Math.random() * 25) + 1;
    const avgMinutes = Math.floor(Math.random() * 8) + 3; // 3-10 minutes
    const avgSeconds = Math.floor(Math.random() * 60);
    const avgDuration = `${avgMinutes}m ${avgSeconds}s`;
    const branch = agentBranches[Math.floor(Math.random() * agentBranches.length)];
    
    generatedAgents.push([name, status, callsToday, avgDuration, branch]);
  }

  const agentStmt = db.prepare(`
    INSERT OR IGNORE INTO call_agents (name, status, calls_today, avg_duration, branch)
    VALUES (?, ?, ?, ?, ?)
  `);

  generatedAgents.forEach(agent => agentStmt.run(agent));
  agentStmt.finalize();

  // Insert sample marketing data with recent dates
  const platforms = ['TikTok', 'Instagram', 'Snapchat', 'Google Ads', 'Facebook', 'Website'];
  const marketing = [];
  
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const leads = Math.floor(Math.random() * 50) + 1;
    const ctr = Math.round((Math.random() * 10 + 1) * 10) / 10; // 1.0-11.0
    const cpl = Math.round((Math.random() * 50 + 5) * 100) / 100; // 5.00-55.00
    
    marketing.push([platform, leads, ctr, cpl, date.toISOString().split('T')[0]]);
  }

  const marketStmt = db.prepare(`
    INSERT OR IGNORE INTO marketing_campaigns (platform, leads, ctr, cpl, date)
    VALUES (?, ?, ?, ?, ?)
  `);

  marketing.forEach(campaign => marketStmt.run(campaign));
  marketStmt.finalize();

  // Insert sample notifications
  const notificationTypes = ['appointment', 'lead', 'system', 'marketing'];
  const notificationMessages = [
    'New appointment scheduled for tomorrow',
    'High-priority lead requires immediate attention',
    'System maintenance completed successfully',
    'Marketing campaign performance report available',
    'Patient follow-up reminder',
    'Lead conversion milestone achieved',
    'New patient registration completed',
    'Appointment cancellation notice'
  ];

  const notifications = [];
  
  for (let i = 0; i < 25; i++) {
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const message = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
    const status = Math.random() > 0.3 ? 'unread' : 'read'; // 70% unread
    
    notifications.push([type, message, status]);
  }

  const notifStmt = db.prepare(`
    INSERT OR IGNORE INTO notifications (type, message, status)
    VALUES (?, ?, ?)
  `);

  notifications.forEach(notif => notifStmt.run(notif));
  notifStmt.finalize();

  console.log('Sample data inserted successfully.');
});

// Close database
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});

export default db;