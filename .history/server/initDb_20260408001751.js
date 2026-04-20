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
  // Leads table
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT DEFAULT 'New Lead',
      ai_score INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      assigned_to TEXT,
      notes TEXT,
      last_contact TEXT
    )
  `);

  // Patients table
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      last_visit DATE,
      dob DATE,
      status TEXT DEFAULT 'Active',
      total_visits INTEGER DEFAULT 0
    )
  `);

  // Appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      date DATE NOT NULL,
      time TEXT NOT NULL,
      doctor TEXT NOT NULL,
      branch TEXT NOT NULL,
      status TEXT DEFAULT 'Scheduled',
      type TEXT NOT NULL,
      patient_history TEXT,
      doctor_notes TEXT,
      special_instructions TEXT
    )
  `);

  // Call Agents table
  db.run(`
    CREATE TABLE IF NOT EXISTS call_agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'Offline',
      calls_today INTEGER DEFAULT 0,
      avg_duration TEXT DEFAULT '0m 0s',
      branch TEXT NOT NULL
    )
  `);

  // Marketing Campaigns table
  db.run(`
    CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      leads INTEGER DEFAULT 0,
      ctr REAL DEFAULT 0,
      cpl REAL DEFAULT 0,
      date DATE DEFAULT CURRENT_DATE
    )
  `);

  // Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      recipient TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables created successfully.');
});

// Insert sample data
db.serialize(() => {
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
    const assignedTo = agents[Math.floor(Math.random() * agents.length)];
    const lastContactHours = Math.floor(Math.random() * 168); // Last 7 days in hours
    const lastContact = lastContactHours < 24 ? `${lastContactHours}h ago` : `${Math.floor(lastContactHours/24)}d ago`;
    
    leads.push([name, phone, source, status, aiScore, createdDate.toISOString().split('T')[0], assignedTo, lastContact]);
  }

  const leadStmt = db.prepare(`
    INSERT OR IGNORE INTO leads (name, phone, source, status, ai_score, created_at, assigned_to, last_contact)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
    const status = Math.random() > 0.3 ? 'Active' : 'Inactive'; // 70% active
    const totalVisits = Math.floor(Math.random() * 20) + 1;
    
    patients.push([name, phone, lastVisit.toISOString().split('T')[0], dob.toISOString().split('T')[0], status, totalVisits]);
  }

  const patientStmt = db.prepare(`
    INSERT OR IGNORE INTO patients (name, phone, last_visit, dob, status, total_visits)
    VALUES (?, ?, ?, ?, ?, ?)
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

  const agents = [];
  
  for (let i = 0; i < 12; i++) {
    const name = agentNames[Math.floor(Math.random() * agentNames.length)];
    const status = agentStatuses[Math.floor(Math.random() * agentStatuses.length)];
    const callsToday = status === 'Offline' ? 0 : Math.floor(Math.random() * 25) + 1;
    const avgMinutes = Math.floor(Math.random() * 8) + 3; // 3-10 minutes
    const avgSeconds = Math.floor(Math.random() * 60);
    const avgDuration = `${avgMinutes}m ${avgSeconds}s`;
    const branch = agentBranches[Math.floor(Math.random() * agentBranches.length)];
    
    agents.push([name, status, callsToday, avgDuration, branch]);
  }

  const agentStmt = db.prepare(`
    INSERT OR IGNORE INTO call_agents (name, status, calls_today, avg_duration, branch)
    VALUES (?, ?, ?, ?, ?)
  `);

  agents.forEach(agent => agentStmt.run(agent));
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