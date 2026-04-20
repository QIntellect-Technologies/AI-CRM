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

  // Insert sample patients
  const patients = [
    ['Zayed Al Mansoori', '+971 50 111 2222', '2026-02-15', '1985-04-10', 'Inactive', 5],
    ['Layla Ibrahim', '+971 55 333 4444', '2026-03-20', '1990-08-22', 'Active', 2],
    ['Tariq Saeed', '+971 52 555 6666', '2026-01-10', '1978-11-05', 'Inactive', 8],
    ['Nour Al Suwaidi', '+971 56 777 8888', '2026-04-01', '1995-04-08', 'Active', 1],
  ];

  const patientStmt = db.prepare(`
    INSERT OR IGNORE INTO patients (name, phone, last_visit, dob, status, total_visits)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  patients.forEach(patient => patientStmt.run(patient));
  patientStmt.finalize();

  // Insert sample appointments
  const appointments = [
    ['Fatima Hassan', '2026-04-08', '10:00 AM', 'Dr. Smith', 'Al Nahda', 'Scheduled', 'Consultation', 'No major prior medical conditions. Mild seasonal allergies.', 'Patient complains of frequent headaches. Need to check blood pressure and suggest an eye exam.', 'Please ensure patient brings previous medical records.'],
    ['Layla Ibrahim', '2026-04-08', '11:30 AM', 'Dr. Jones', 'Deira', 'Scheduled', 'Treatment', 'Diagnosed with Type 2 Diabetes in 2024. Currently on Metformin.', 'Routine checkup for diabetes management. Blood sugar levels have been stable.', 'Fasting required for blood tests.'],
    ['Nour Al Suwaidi', '2026-04-07', '09:00 AM', 'Dr. Smith', 'Al Nahda', 'Completed', 'Consultation', 'First visit for general checkup.', 'Patient is in good health. Recommended annual checkup.', ''],
  ];

  const apptStmt = db.prepare(`
    INSERT OR IGNORE INTO appointments (patient_name, date, time, doctor, branch, status, type, patient_history, doctor_notes, special_instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  appointments.forEach(appt => apptStmt.run(appt));
  apptStmt.finalize();

  // Insert sample call agents
  const agents = [
    ['Sara Ahmed', 'Available', 12, '5m 30s', 'Al Nahda'],
    ['Khalid Hassan', 'On Call', 8, '4m 15s', 'Deira'],
    ['Reem Saleh', 'Wrap-up', 15, '6m 45s', 'Al Nahda'],
    ['Nour Al-Din', 'Offline', 0, '0m 0s', 'Burjuman'],
  ];

  const agentStmt = db.prepare(`
    INSERT OR IGNORE INTO call_agents (name, status, calls_today, avg_duration, branch)
    VALUES (?, ?, ?, ?, ?)
  `);

  agents.forEach(agent => agentStmt.run(agent));
  agentStmt.finalize();

  // Insert sample marketing data
  const marketing = [
    ['TikTok', 145, 4.2, 12],
    ['Instagram', 95, 3.8, 18],
    ['Snapchat', 65, 2.5, 22],
    ['Google Ads', 40, 1.8, 35],
  ];

  const marketStmt = db.prepare(`
    INSERT OR IGNORE INTO marketing_campaigns (platform, leads, ctr, cpl)
    VALUES (?, ?, ?, ?)
  `);

  marketing.forEach(campaign => marketStmt.run(campaign));
  marketStmt.finalize();

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