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

  const doctors = ['Dr. Smith', 'Dr. Jones', 'Dr. Brown', 'Dr. Wilson', 'Dr. Davis'];
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
  const aptBranches = ['Al Nahda', 'Deira', 'Burjuman', 'Jumeirah', 'Dubai Marina'];
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
    const branchId = Math.floor(Math.random() * 5) + 1; // 1-5 branches
    const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
    const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const reminderSent = Math.random() > 0.7; // 30% have reminders sent
    const followUpRequired = Math.random() > 0.8; // 20% require follow-up
    
    appointments.push([
      patientName, 
      null, // patient_id (will be set later)
      appointmentDate.toISOString().split('T')[0], 
      time, 
      doctor, 
      branchId, 
      status, 
      type,
      'Patient medical history notes',
      'Doctor examination notes',
      'Special instructions for appointment',
      reminderSent,
      followUpRequired
    ]);
  }

  const apptStmt = db.prepare(`
    INSERT OR IGNORE INTO appointments (patient_name, patient_id, date, time, doctor, branch_id, status, type, patient_history, doctor_notes, special_instructions, reminder_sent, follow_up_required)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  appointments.forEach(appt => apptStmt.run(appt));
  apptStmt.finalize();

  // Insert sample call agents with realistic activity
  const agentStatuses = ['Available', 'On Call', 'Wrap-up', 'Offline'];
  const agentSkills = ['Consultation', 'Treatment', 'Follow-up', 'Emergency', 'General'];
  const agentNames = ['Sara Ahmed', 'Khalid Hassan', 'Reem Saleh', 'Nour Al-Din', 'Ahmed Al-Mansoori', 'Fatima Al-Zaabi', 'Tariq Saeed', 'Layla Ibrahim'];

  const generatedAgents = [];
  
  for (let i = 0; i < 12; i++) {
    const name = agentNames[Math.floor(Math.random() * agentNames.length)];
    const status = agentStatuses[Math.floor(Math.random() * agentStatuses.length)];
    const callsToday = status === 'Offline' ? 0 : Math.floor(Math.random() * 25) + 1;
    const avgMinutes = Math.floor(Math.random() * 8) + 3; // 3-10 minutes
    const avgSeconds = Math.floor(Math.random() * 60);
    const avgDuration = `${avgMinutes}m ${avgSeconds}s`;
    const branchId = Math.floor(Math.random() * 5) + 1; // 1-5 branches
    const skills = JSON.stringify(agentSkills.slice(0, Math.floor(Math.random() * 3) + 2)); // 2-4 skills
    const performanceScore = Math.random() * 100; // 0-100
    const lastActive = status !== 'Offline' ? new Date().toISOString() : new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
    
    generatedAgents.push([name, status, callsToday, avgDuration, branchId, skills, performanceScore, lastActive]);
  }

  const agentStmt = db.prepare(`
    INSERT OR IGNORE INTO call_agents (name, status, calls_today, avg_duration, branch_id, skills, performance_score, last_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

  // Insert enhanced marketing campaigns
  const campaignNames = [
    'Summer Dental Campaign', 'Laser Hair Removal Promo', 'General Checkup Drive',
    'Derma Fillers Special', 'Teeth Whitening Offer', 'Skin Consultation Month',
    'Family Health Package', 'Senior Citizen Discount', 'Student Special Offer'
  ];

  const enhancedCampaigns = [];
  for (let i = 0; i < 15; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const campaignName = campaignNames[Math.floor(Math.random() * campaignNames.length)];
    const budget = Math.floor(Math.random() * 10000) + 1000;
    const spent = Math.floor(Math.random() * budget);
    const leads = Math.floor(Math.random() * 100) + 10;
    const conversions = Math.floor(leads * (Math.random() * 0.3 + 0.1)); // 10-40% conversion
    const ctr = Math.round((Math.random() * 8 + 2) * 10) / 10; // 2.0-10.0
    const cpl = Math.round((spent / leads) * 100) / 100;
    const roi = Math.round((Math.random() * 200 + 50) * 10) / 10; // 50-250
    const status = ['Active', 'Paused', 'Completed'][Math.floor(Math.random() * 3)];
    const startDate = new Date(today.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date(new Date(startDate).getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const targetAudience = ['18-25', '26-35', '36-45', '46+', 'All Ages'][Math.floor(Math.random() * 5)];
    const aiOptimization = Math.random() > 0.5;

    enhancedCampaigns.push([platform, campaignName, budget, spent, leads, conversions, ctr, cpl, roi, status, startDate, endDate, targetAudience, aiOptimization]);
  }

  const enhancedCampaignStmt = db.prepare(`
    INSERT OR IGNORE INTO marketing_campaigns (platform, campaign_name, budget, spent, leads, conversions, ctr, cpl, roi, status, start_date, end_date, target_audience, ai_optimization)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  enhancedCampaigns.forEach(campaign => enhancedCampaignStmt.run(campaign));
  enhancedCampaignStmt.finalize();

  // Insert automated workflows
  const workflows = [
    ['lead_created', '{"source": "social_media"}', '[{"type": "notification", "channel": "system", "message": "New lead from {{source}} requires attention"}, {"type": "assignment", "method": "round_robin"}]', 1],
    ['appointment_scheduled', '{"advance_notice": "24h"}', '[{"type": "sms", "template": "appointment_reminder"}, {"type": "email", "template": "appointment_confirmation"}]', 1],
    ['patient_inactive', '{"days_inactive": "30"}', '[{"type": "sms", "template": "reengagement_offer"}, {"type": "email", "template": "loyalty_program"}]', 1],
    ['lead_followup_due', '{"priority": "high"}', '[{"type": "notification", "channel": "agent", "message": "Follow-up due for high-priority lead"}]', 1],
    ['appointment_completed', '{}', '[{"type": "sms", "template": "feedback_request"}, {"type": "notification", "channel": "system", "message": "Appointment completed - schedule follow-up"}]', 1]
  ];

  const workflowStmt = db.prepare(`
    INSERT OR IGNORE INTO automated_workflows (name, trigger_type, conditions, actions, is_active)
    VALUES (?, ?, ?, ?, ?)
  `);

  workflows.forEach(workflow => workflowStmt.run(workflow));
  workflowStmt.finalize();

  // Insert enhanced notifications
  const enhancedNotifications = [];
  for (let i = 0; i < 30; i++) {
    const types = ['sms', 'email', 'push', 'system'];
    const type = types[Math.floor(Math.random() * types.length)];
    const recipientTypes = ['patient', 'agent', 'admin'];
    const recipientType = recipientTypes[Math.floor(Math.random() * recipientTypes.length)];
    const recipientId = Math.floor(Math.random() * 50) + 1;
    const recipientContact = type === 'sms' ? `+971${Math.floor(Math.random() * 900000000) + 500000000}` : `user${recipientId}@polyclinic.ae`;
    
    const titles = [
      'Appointment Reminder', 'New Lead Assigned', 'Patient Re-engagement', 'Follow-up Required',
      'Campaign Performance', 'System Alert', 'Payment Due', 'Feedback Request'
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    const messages = [
      'Your appointment is scheduled for tomorrow at 10:00 AM',
      'New high-priority lead assigned to your queue',
      'We haven\'t seen you in 30 days - special offer available',
      'Patient follow-up required within 24 hours',
      'Marketing campaign exceeded target by 25%',
      'System maintenance completed successfully',
      'Invoice payment due in 7 days',
      'Please rate your recent appointment experience'
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const status = ['pending', 'sent', 'failed'][Math.floor(Math.random() * 3)];
    const priorities = ['low', 'normal', 'high', 'urgent'];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const scheduledAt = status === 'pending' ? new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : null;
    const sentAt = status === 'sent' ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : null;
    const workflowId = Math.floor(Math.random() * 5) + 1;
    const entityTypes = ['lead', 'appointment', 'patient', 'invoice'];
    const relatedEntityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const relatedEntityId = Math.floor(Math.random() * 50) + 1;

    enhancedNotifications.push([type, recipientType, recipientId, recipientContact, title, message, status, priority, scheduledAt, sentAt, workflowId, relatedEntityType, relatedEntityId]);
  }

  const enhancedNotifStmt = db.prepare(`
    INSERT OR IGNORE INTO notifications (type, recipient_type, recipient_id, recipient_contact, title, message, status, priority, scheduled_at, sent_at, workflow_id, related_entity_type, related_entity_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  enhancedNotifications.forEach(notif => enhancedNotifStmt.run(notif));
  enhancedNotifStmt.finalize();

  // Insert sample invoices
  const invoices = [];
  for (let i = 0; i < 40; i++) {
    const patientId = Math.floor(Math.random() * 80) + 1;
    const appointmentId = Math.floor(Math.random() * 50) + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const amount = Math.floor(Math.random() * 2000) + 200; // 200-2200 AED
    const taxAmount = Math.round(amount * 0.05 * 100) / 100; // 5% tax
    const discount = Math.random() > 0.8 ? Math.round(amount * 0.1 * 100) / 100 : 0; // 10% discount sometimes
    const totalAmount = amount + taxAmount - discount;
    const statuses = ['Paid', 'Unpaid', 'Overdue', 'Cancelled'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const dueDate = new Date(today.getTime() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const paidDate = status === 'Paid' ? new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
    const paymentMethods = ['Cash', 'Card', 'Insurance', 'Bank Transfer'];
    const paymentMethod = status === 'Paid' ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : null;
    const notes = ['Standard consultation', 'Treatment package', 'Follow-up visit', 'Emergency procedure'][Math.floor(Math.random() * 4)];

    invoices.push([patientId, appointmentId, invoiceNumber, amount, taxAmount, discount, totalAmount, status, dueDate, paidDate, paymentMethod, notes]);
  }

  const invoiceStmt = db.prepare(`
    INSERT OR IGNORE INTO invoices (patient_id, appointment_id, invoice_number, amount, tax_amount, discount, total_amount, status, due_date, paid_date, payment_method, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  invoices.forEach(invoice => invoiceStmt.run(invoice));
  invoiceStmt.finalize();

  // Insert invoice items
  const services = [
    { name: 'General Consultation', price: 200 },
    { name: 'Dental Cleaning', price: 350 },
    { name: 'X-Ray', price: 150 },
    { name: 'Blood Test', price: 100 },
    { name: 'Laser Treatment', price: 800 },
    { name: 'Skin Consultation', price: 250 },
    { name: 'Follow-up Visit', price: 150 },
    { name: 'Emergency Treatment', price: 500 }
  ];

  // Get all invoice IDs to add items
  db.all('SELECT id FROM invoices', [], (err, invoiceRows) => {
    if (err) {
      console.error('Error getting invoices:', err);
      return;
    }

    const invoiceItems = [];
    invoiceRows.forEach(invoice => {
      const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items per invoice
      for (let i = 0; i < itemCount; i++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = service.price;
        const totalPrice = unitPrice * quantity;
        
        invoiceItems.push([invoice.id, service.name, quantity, unitPrice, totalPrice, `Service provided on ${new Date().toLocaleDateString()}`]);
      }
    });

    const itemStmt = db.prepare(`
      INSERT OR IGNORE INTO invoice_items (invoice_id, service_name, quantity, unit_price, total_price, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    invoiceItems.forEach(item => itemStmt.run(item));
    itemStmt.finalize();
  });

  // Insert AI predictions
  const predictions = [];
  for (let i = 0; i < 20; i++) {
    const predictionTypes = ['appointment_demand', 'lead_conversion', 'patient_churn'];
    const predictionType = predictionTypes[Math.floor(Math.random() * predictionTypes.length)];
    const entityTypes = ['branch', 'doctor', 'campaign'];
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const entityId = Math.floor(Math.random() * 5) + 1;
    const predictionDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let predictedValue;
    let factors;
    
    if (predictionType === 'appointment_demand') {
      predictedValue = Math.floor(Math.random() * 50) + 20; // 20-70 appointments
      factors = JSON.stringify({
        historical_data: 'Last 30 days average',
        seasonal_trend: 'Increasing',
        marketing_impact: 'High'
      });
    } else if (predictionType === 'lead_conversion') {
      predictedValue = Math.round((Math.random() * 0.4 + 0.3) * 100) / 100; // 0.3-0.7 conversion rate
      factors = JSON.stringify({
        lead_quality: 'Above average',
        agent_performance: 'Good',
        campaign_effectiveness: 'Strong'
      });
    } else { // patient_churn
      predictedValue = Math.round((Math.random() * 0.2 + 0.05) * 100) / 100; // 0.05-0.25 churn rate
      factors = JSON.stringify({
        inactivity_period: '30+ days',
        engagement_score: 'Low',
        competitor_activity: 'Moderate'
      });
    }
    
    const confidenceScore = Math.round((Math.random() * 0.4 + 0.6) * 100) / 100; // 0.6-1.0 confidence

    predictions.push([predictionType, entityType, entityId, predictionDate, predictedValue, confidenceScore, factors]);
  }

  const predictionStmt = db.prepare(`
    INSERT OR IGNORE INTO ai_predictions (prediction_type, entity_type, entity_id, prediction_date, predicted_value, confidence_score, factors)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  predictions.forEach(prediction => predictionStmt.run(prediction));
  predictionStmt.finalize();

  // Insert call recordings
  const callRecordings = [];
  for (let i = 0; i < 35; i++) {
    const callId = `CALL-${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    const agentId = Math.floor(Math.random() * 12) + 1;
    const leadId = Math.random() > 0.3 ? Math.floor(Math.random() * 120) + 1 : null; // 70% have leads
    const patientId = Math.random() > 0.4 ? Math.floor(Math.random() * 80) + 1 : null; // 60% have patients
    const duration = Math.floor(Math.random() * 1800) + 60; // 1-30 minutes
    const recordingUrl = `https://storage.polyclinic.ae/recordings/${callId}.mp3`;
    const transcriptions = [
      'Patient called for appointment rescheduling',
      'New patient inquiry about dental services',
      'Follow-up call for treatment completion',
      'Insurance claim inquiry',
      'General consultation booking'
    ];
    const transcription = transcriptions[Math.floor(Math.random() * transcriptions.length)];
    const qualityScore = Math.round((Math.random() * 0.5 + 0.5) * 100) / 100; // 0.5-1.0
    const feedbacks = [
      'Excellent communication skills',
      'Needs improvement in product knowledge',
      'Good rapport building',
      'Professional and courteous',
      'Could be more efficient'
    ];
    const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    const callDate = new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();

    callRecordings.push([callId, agentId, leadId, patientId, duration, recordingUrl, transcription, qualityScore, feedback, callDate]);
  }

  const recordingStmt = db.prepare(`
    INSERT OR IGNORE INTO call_recordings (call_id, agent_id, lead_id, patient_id, duration, recording_url, transcription, quality_score, feedback, call_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  callRecordings.forEach(recording => recordingStmt.run(recording));
  recordingStmt.finalize();

  console.log('Enhanced sample data inserted successfully.');
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