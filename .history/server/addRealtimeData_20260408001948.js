import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to existing database
const dbPath = path.join(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database for manual data addition.');
  }
});

// Function to add a new lead
function addNewLead(name, phone, source = 'Website', status = 'New Lead') {
  const aiScore = Math.floor(Math.random() * 100) + 1;
  const agents = ['Sara Ahmed', 'Khalid Hassan', 'Reem Saleh', 'Nour Al-Din'];
  const assignedTo = agents[Math.floor(Math.random() * agents.length)];
  const lastContact = 'Just now';

  const stmt = db.prepare(`
    INSERT INTO leads (name, phone, source, status, ai_score, created_at, assigned_to, last_contact)
    VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?)
  `);

  stmt.run([name, phone, source, status, aiScore, assignedTo, lastContact], function(err) {
    if (err) {
      console.error('Error adding lead:', err.message);
    } else {
      console.log(`✅ Added new lead: ${name} (ID: ${this.lastID})`);
    }
    stmt.finalize();
  });
}

// Function to add a new patient
function addNewPatient(name, phone, dob) {
  const lastVisit = new Date().toISOString().split('T')[0];
  const status = 'Active';
  const totalVisits = 1;

  const stmt = db.prepare(`
    INSERT INTO patients (name, phone, last_visit, dob, status, total_visits)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run([name, phone, lastVisit, dob, status, totalVisits], function(err) {
    if (err) {
      console.error('Error adding patient:', err.message);
    } else {
      console.log(`✅ Added new patient: ${name} (ID: ${this.lastID})`);
    }
    stmt.finalize();
  });
}

// Function to add a new appointment
function addNewAppointment(patientName, date, time, doctor = 'Dr. Smith', branch = 'Al Nahda') {
  const stmt = db.prepare(`
    INSERT INTO appointments (patient_name, date, time, doctor, branch, status, type, patient_history, doctor_notes, special_instructions)
    VALUES (?, ?, ?, ?, ?, 'Scheduled', 'Consultation', 'New patient consultation', 'Initial examination', 'Bring ID and insurance card')
  `);

  stmt.run([patientName, date, time, doctor, branch], function(err) {
    if (err) {
      console.error('Error adding appointment:', err.message);
    } else {
      console.log(`✅ Added new appointment for: ${patientName} on ${date} at ${time}`);
    }
    stmt.finalize();
  });
}

// Add some sample real-time data
console.log('🚀 Adding real-time sample data...\n');

// Add new leads
addNewLead('Ahmed Al-Mansoori', '+971 50 999 8888', 'Instagram', 'New Lead');
addNewLead('Fatima Al-Zaabi', '+971 55 777 6666', 'TikTok', 'Contacted');
addNewLead('Mohammed Hassan', '+971 52 555 4444', 'Facebook', 'Appointment Set');
addNewLead('Aisha Al-Rashid', '+971 56 333 2222', 'Google Ads', 'New Lead');
addNewLead('Omar Al-Falasi', '+971 54 111 0000', 'Website', 'New Lead');

// Add new patients
addNewPatient('Layla Al-Maktoum', '+971 50 123 9999', '1995-03-15');
addNewPatient('Rashid Al-Suwaidi', '+971 55 456 8888', '1988-07-22');
addNewPatient('Noor Al-Hamad', '+971 52 789 7777', '1992-11-08');

// Add new appointments for today and tomorrow
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

addNewAppointment('Ahmed Al-Mansoori', today, '02:00 PM');
addNewAppointment('Fatima Al-Zaabi', today, '03:30 PM');
addNewAppointment('Layla Al-Maktoum', tomorrow, '10:00 AM');
addNewAppointment('Rashid Al-Suwaidi', tomorrow, '11:30 AM');

console.log('\n✨ Real-time data addition complete!');
console.log('📊 Dashboard should now show updated statistics.');
console.log('🔄 Refresh your browser to see the new data.\n');

// Close database after a short delay to allow async operations to complete
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}, 2000);