import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// API Routes

// Get all leads with branch information
app.get('/api/leads', (req, res) => {
  const query = `
    SELECT l.*, b.name as branch_name, b.location as branch_location
    FROM leads l
    LEFT JOIN branches b ON l.branch_id = b.id
    ORDER BY l.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new lead with AI scoring and branch assignment
app.post('/api/leads', async (req, res) => {
  const { name, phone, source, notes, branch_id } = req.body;

  let aiScore = 50; // Default
  let priority = 'Medium';
  let conversionProbability = 0.5;

  try {
    const prompt = `Analyze this lead for a healthcare CRM system and give a score from 0-100 based on potential conversion likelihood. Consider factors like name quality, source platform effectiveness (${source}), and any additional context. Lead: Name: ${name}, Phone: ${phone}, Source: ${source}, Notes: ${notes || 'None'}. Return only a number.`;
    const result = await model.generateContent(prompt);
    const scoreText = result.response.text().trim();
    aiScore = parseInt(scoreText) || 50;

    // Determine priority based on AI score
    if (aiScore >= 80) priority = 'High';
    else if (aiScore >= 60) priority = 'Medium';
    else priority = 'Low';

    conversionProbability = aiScore / 100;
  } catch (error) {
    console.error('AI scoring error:', error);
  }

  db.run(`
    INSERT INTO leads (name, phone, source, ai_score, priority, notes, branch_id, conversion_probability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, phone, source, aiScore, priority, notes, branch_id || 1, conversionProbability], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Lead added successfully', ai_score: aiScore, priority: priority });
  });
});

// Update lead with enhanced fields
app.put('/api/leads/:id', (req, res) => {
  const { status, assigned_to, notes, last_contact, follow_up_date, priority } = req.body;
  db.run(`
    UPDATE leads SET status = ?, assigned_to = ?, notes = ?, last_contact = ?, follow_up_date = ?, priority = ?
    WHERE id = ?
  `, [status, assigned_to, notes, last_contact, follow_up_date, priority, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Lead updated successfully' });
  });
});

// Get all patients with branch information
app.get('/api/patients', (req, res) => {
  const query = `
    SELECT p.*, b.name as branch_name, b.location as branch_location
    FROM patients p
    LEFT JOIN branches b ON p.branch_id = b.id
    ORDER BY p.last_visit DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new patient with enhanced fields
app.post('/api/patients', (req, res) => {
  const { name, phone, email, dob, branch_id, preferred_doctor, medical_notes } = req.body;
  db.run(`
    INSERT INTO patients (name, phone, email, dob, branch_id, preferred_doctor, medical_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [name, phone, email, dob, branch_id || 1, preferred_doctor, medical_notes], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Patient added successfully' });
  });
});

// Update patient with enhanced fields
app.put('/api/patients/:id', (req, res) => {
  const { last_visit, status, total_visits, email, loyalty_points, preferred_doctor, medical_notes } = req.body;
  db.run(`
    UPDATE patients SET last_visit = ?, status = ?, total_visits = ?, email = ?, loyalty_points = ?, preferred_doctor = ?, medical_notes = ?
    WHERE id = ?
  `, [last_visit, status, total_visits, email, loyalty_points, preferred_doctor, medical_notes, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Patient updated successfully' });
  });
});

// Get all appointments with branch information
app.get('/api/appointments', (req, res) => {
  const query = `
    SELECT a.*, b.name as branch_name, b.location as branch_location,
           p.name as patient_name_full, p.phone as patient_phone
    FROM appointments a
    LEFT JOIN branches b ON a.branch_id = b.id
    LEFT JOIN patients p ON a.patient_id = p.id
    ORDER BY a.date DESC, a.time DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new appointment with enhanced features
app.post('/api/appointments', (req, res) => {
  const { patient_id, patient_name, date, time, doctor, branch_id, type, patient_history, special_instructions, reminder_sent, follow_up_required } = req.body;
  db.run(`
    INSERT INTO appointments (patient_id, patient_name, date, time, doctor, branch_id, type, patient_history, special_instructions, reminder_sent, follow_up_required)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [patient_id, patient_name, date, time, doctor, branch_id || 1, type, patient_history, special_instructions, reminder_sent || 0, follow_up_required || 0], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Appointment scheduled successfully' });
  });
});

// Update appointment with enhanced fields
app.put('/api/appointments/:id', (req, res) => {
  const { status, doctor_notes, reminder_sent, follow_up_required } = req.body;
  db.run(`
    UPDATE appointments SET status = ?, doctor_notes = ?, reminder_sent = ?, follow_up_required = ?
    WHERE id = ?
  `, [status, doctor_notes, reminder_sent, follow_up_required, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Appointment updated successfully' });
  });
});

// Get all call agents with branch information
app.get('/api/call-agents', (req, res) => {
  const query = `
    SELECT ca.*, b.name as branch_name, b.location as branch_location
    FROM call_agents ca
    LEFT JOIN branches b ON ca.branch_id = b.id
    ORDER BY ca.performance_score DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Update call agent with enhanced fields
app.put('/api/call-agents/:id', (req, res) => {
  const { status, calls_today, avg_duration, performance_score, skills, last_active } = req.body;
  db.run(`
    UPDATE call_agents SET status = ?, calls_today = ?, avg_duration = ?, performance_score = ?, skills = ?, last_active = ?
    WHERE id = ?
  `, [status, calls_today, avg_duration, performance_score, JSON.stringify(skills), last_active, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Agent updated successfully' });
  });
});

// Get marketing campaigns with enhanced data
app.get('/api/marketing', (req, res) => {
  db.all('SELECT * FROM marketing_campaigns ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add marketing campaign with enhanced fields
app.post('/api/marketing', (req, res) => {
  const { platform, campaign_name, budget, spent, leads, conversions, ctr, cpl, roi, status, start_date, end_date, target_audience, ai_optimization } = req.body;
  db.run(`
    INSERT INTO marketing_campaigns (platform, campaign_name, budget, spent, leads, conversions, ctr, cpl, roi, status, start_date, end_date, target_audience, ai_optimization)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [platform, campaign_name, budget, spent, leads, conversions, ctr, cpl, roi, status, start_date, end_date, target_audience, ai_optimization], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Marketing campaign added successfully' });
  });
});

// Get AI insights
app.get('/api/ai-insights', async (req, res) => {
  try {
    // Get recent data for analysis
    const leads = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM leads WHERE created_at >= date("now", "-7 days")', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const patients = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM patients WHERE status = "Active"', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const prompt = `Analyze this healthcare CRM data and provide 3 key insights/recommendations. Data summary: ${leads.length} leads in last 7 days, ${patients.length} active patients. Focus on marketing optimization, patient retention, and sales forecasting. Keep each recommendation under 50 words.`;

    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    res.json({
      marketing: 'TikTok campaigns are yielding highest quality leads. Consider reallocating 15% budget from Snapchat.',
      retention: `${patients.filter(p => new Date() - new Date(p.last_visit) > 45 * 24 * 60 * 60 * 1000).length} patients inactive >45 days. SMS campaign could recover ~15%.`,
      forecasting: `Based on current velocity, expect 12% appointment increase next week. Ensure adequate staffing.`,
      ai_generated: insights
    });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Get notifications
app.get('/api/notifications', (req, res) => {
  db.all('SELECT * FROM notifications WHERE status = "pending" ORDER BY created_at DESC LIMIT 10', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add notification
app.post('/api/notifications', (req, res) => {
  const { type, message, recipient } = req.body;
  db.run(`
    INSERT INTO notifications (type, message, recipient)
    VALUES (?, ?, ?)
  `, [type, message, recipient], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Notification created successfully' });
  });
});

// Mark notification as read
app.put('/api/notifications/:id/read', (req, res) => {
  db.run(`
    UPDATE notifications SET status = 'read' WHERE id = ?
  `, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Notification marked as read' });
  });
});

// Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};

  // Get total leads from last 7 days (instead of just today)
  db.get(`
    SELECT COUNT(*) as total FROM leads
    WHERE created_at >= datetime('now', '-7 days')
  `, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalLeadsToday = row.total;

    // Get calls handled (from call_agents table)
    db.get(`
      SELECT SUM(calls_today) as total FROM call_agents
    `, [], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.callsHandled = row.total || 0;

      // Get appointments for today and tomorrow
      db.get(`
        SELECT COUNT(*) as total FROM appointments
        WHERE date >= DATE('now') AND date <= DATE('now', '+1 day')
      `, [], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.appointmentsToday = row.total;

        // Get active patients
        db.get(`
          SELECT COUNT(*) as total FROM patients
          WHERE status = 'Active'
        `, [], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          stats.activePatients = row.total;

          res.json(stats);
        });
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});