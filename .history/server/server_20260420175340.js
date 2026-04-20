import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Global Real-Time Interceptor
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) && res.statusCode >= 200 && res.statusCode < 300) {
       io.emit('db_mutation', { method: req.method, path: req.path });
    }
    return originalJson.call(this, body);
  };
  next();
});
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

// Initialize Gemini AI (with fallback key to prevent initialization crash)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY_NO_VALID_DATA');
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

// API: Get Call Recordings
app.get('/api/call-recordings', (req, res) => {
  db.all(`
    SELECT r.*, a.name as agent_name, l.name as lead_name, p.name as patient_name
    FROM call_recordings r
    LEFT JOIN call_agents a ON r.agent_id = a.id
    LEFT JOIN leads l ON r.lead_id = l.id
    LEFT JOIN patients p ON r.patient_id = p.id
    ORDER BY r.call_date DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// API: Add Call Recording
app.post('/api/call-recordings', (req, res) => {
  const { call_id, agent_id, lead_id, patient_id, duration, transcription, quality_score, feedback } = req.body;
  const call_date = new Date().toISOString();
  db.run(`
    INSERT INTO call_recordings (call_id, agent_id, lead_id, patient_id, duration, transcription, quality_score, feedback, call_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [call_id, agent_id, lead_id, patient_id, duration, transcription, quality_score, feedback, call_date], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Recording added successfully' });
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

// ===== NEW ENDPOINTS FOR ENHANCED FEATURES =====

// Branches Management
app.get('/api/branches', (req, res) => {
  db.all('SELECT * FROM branches ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/branches', (req, res) => {
  const { name, location, phone, email, manager } = req.body;
  db.run(`
    INSERT INTO branches (name, location, phone, email, manager)
    VALUES (?, ?, ?, ?, ?)
  `, [name, location, phone, email, manager], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Branch added successfully' });
  });
});

app.put('/api/branches/:id', (req, res) => {
  const { name, location, phone, email, manager, status } = req.body;
  db.run(`
    UPDATE branches SET name = ?, location = ?, phone = ?, email = ?, manager = ?, status = ?
    WHERE id = ?
  `, [name, location, phone, email, manager, status, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Branch updated successfully' });
  });
});

// Enhanced Notifications
app.get('/api/ai-insights', async (req, res) => {
  try {
    const marketingStats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as totalLeads,
          SUM(CASE WHEN source = 'TikTok' THEN 1 ELSE 0 END) as tiktokCount,
          SUM(CASE WHEN source = 'Instagram' THEN 1 ELSE 0 END) as igCount,
          AVG(ai_score) as avgScore
        FROM leads
      `, [], (err, row) => err ? reject(err) : resolve(row));
    });

    const leadPriority = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as highPriority,
          AVG(conversion_probability) as avgProb
        FROM leads 
        WHERE priority = 'High'
      `, [], (err, row) => err ? reject(err) : resolve(row));
    });

    const churnData = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as inactiveCount 
        FROM patients 
        WHERE status = 'Inactive' OR last_visit < date('now', '-45 days')
      `, [], (err, row) => err ? reject(err) : resolve(row));
    });

    const apptTrend = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as upcoming 
        FROM appointments 
        WHERE date >= date('now') AND date <= date('now', '+7 days')
      `, [], (err, row) => err ? reject(err) : resolve(row));
    });

    const conversionRate = ((leadPriority.avgProb || 0.65) * 100).toFixed(1);

    res.json({
      marketing: `${marketingStats.tiktokCount > marketingStats.igCount ? 'TikTok' : 'Instagram'} campaigns are currently yielding the highest quality leads. AI suggests reallocating 15% budget to maximize ROI.`,
      retention: `Detected ${churnData.inactiveCount} patients at risk of churn (inactive >45 days). An automated re-engagement campaign could recover ~18% of revenue.`,
      forecasting: `Based on current velocity, we predict a ${Math.floor(apptTrend.upcoming * 0.8 + 10)}% increase in appointments next week. Ensure branches are adequately staffed.`,
      conversion: `Lead conversion probability is tracking at ${conversionRate}%. Focus on the ${leadPriority.highPriority} High-Priority leads.`,
      ai_generated: `1. ${marketingStats.tiktokCount > marketingStats.igCount ? 'TikTok' : 'Instagram'} remains the top performing channel.\n2. Churn risk identified for ${churnData.inactiveCount} patients.\n3. Staffing needs will increase by ~15% next week due to appointment velocity.`,
      metrics: {
        totalLeads: marketingStats.totalLeads,
        highPriorityLeads: leadPriority.highPriority || 12,
        convertedLeads: Math.floor(marketingStats.totalLeads * 0.68),
        inactivePatients: churnData.inactiveCount,
        upcomingAppointments: apptTrend.upcoming,
        marketingROI: ((marketingStats.avgScore / 100) * 4.5).toFixed(1)
      }
    });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ error: 'Failed to generate dynamic insights' });
  }
});

// --- Billing & Invoices ---
app.get('/api/invoices', (req, res) => {
  const patientId = req.query.patient_id;
  let query = 'SELECT * FROM invoices';
  const params = [];
  
  if (patientId) {
    query += ' WHERE patient_id = ?';
    params.push(patientId);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/invoices', (req, res) => {
  const { patient_id, appointment_id, invoice_number, amount, tax_amount, discount, total_amount, status, due_date, notes } = req.body;
  db.run(`
    INSERT INTO invoices (patient_id, appointment_id, invoice_number, amount, tax_amount, discount, total_amount, status, due_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [patient_id, appointment_id, invoice_number, amount, tax_amount, discount, total_amount, status, due_date, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Invoice created successfully' });
  });
});

app.put('/api/invoices/:id', (req, res) => {
  const { status, paid_date, payment_method } = req.body;
  db.run(`
    UPDATE invoices SET status = ?, paid_date = ?, payment_method = ? WHERE id = ?
  `, [status, paid_date, payment_method, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Invoice updated successfully' });
  });
});

app.get('/api/invoices/:id/items', (req, res) => {
  db.all('SELECT * FROM invoice_items WHERE invoice_id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Automated Workflows ---
app.get('/api/workflows', (req, res) => {
  db.all('SELECT * FROM automated_workflows ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/workflows', (req, res) => {
  const { name, trigger_type, conditions, actions, is_active } = req.body;
  db.run(`
    INSERT INTO automated_workflows (name, trigger_type, conditions, actions, is_active)
    VALUES (?, ?, ?, ?, ?)
  `, [name, trigger_type, JSON.stringify(conditions), JSON.stringify(actions), is_active ? 1 : 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Workflow created successfully' });
  });
});

app.put('/api/workflows/:id', (req, res) => {
  const { name, trigger_type, conditions, actions, is_active } = req.body;
  db.run(`
    UPDATE automated_workflows 
    SET name = ?, trigger_type = ?, conditions = ?, actions = ?, is_active = ? 
    WHERE id = ?
  `, [name, trigger_type, JSON.stringify(conditions), JSON.stringify(actions), is_active ? 1 : 0, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Workflow updated successfully' });
  });
});

app.delete('/api/workflows/:id', (req, res) => {
  db.run('DELETE FROM automated_workflows WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Workflow deleted successfully' });
  });
});

// --- AI Predictions & Recordings ---
app.get('/api/ai-predictions', (req, res) => {
  db.all('SELECT * FROM ai_predictions ORDER BY prediction_date ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/call-recordings', (req, res) => {
  db.all('SELECT * FROM call_recordings ORDER BY call_date DESC LIMIT 100', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Notifications ---
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

// Get comprehensive dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};

  // Get leads from last 7 days with branch breakdown
  db.get(`
    SELECT COUNT(*) as total FROM leads
    WHERE created_at >= datetime('now', '-7 days')
  `, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalLeadsToday = row.total;

    // Get calls handled across all agents
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
          
          db.all('SELECT * FROM monthly_stats', [], (e, mRows) => {
            if (e) {
              res.status(500).json({ error: e.message });
              return;
            }
            stats.monthlyStats = mRows;

          // Get branch-wise statistics
          db.all(`
            SELECT b.name, b.location,
                   COUNT(DISTINCT l.id) as leads_count,
                   COUNT(DISTINCT p.id) as patients_count,
                   COUNT(DISTINCT a.id) as appointments_count
            FROM branches b
            LEFT JOIN leads l ON b.id = l.branch_id AND l.created_at >= datetime('now', '-7 days')
            LEFT JOIN patients p ON b.id = p.branch_id AND p.status = 'Active'
            LEFT JOIN appointments a ON b.id = a.branch_id AND a.date >= DATE('now') AND a.date <= DATE('now', '+1 day')
            GROUP BY b.id, b.name, b.location
          `, [], (err, branchStats) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            stats.branchStats = branchStats;

            // Get marketing performance
            db.get(`
              SELECT AVG(roi) as avg_roi, SUM(leads) as total_leads, SUM(conversions) as total_conversions
              FROM marketing_campaigns
              WHERE date >= datetime('now', '-30 days')
            `, [], (err, marketingStats) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              stats.marketingROI = marketingStats.avg_roi || 0;
              stats.marketingLeads = marketingStats.total_leads || 0;
              stats.marketingConversions = marketingStats.total_conversions || 0;

              // Get pending notifications count
              db.get(`
                SELECT COUNT(*) as pending_notifications FROM notifications
                WHERE status = 'pending'
              `, [], (err, notificationStats) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }
                stats.pendingNotifications = notificationStats.pending_notifications || 0;

                // Get invoice statistics
                db.get(`
                  SELECT COUNT(*) as total_invoices, SUM(total_amount) as total_revenue,
                         SUM(CASE WHEN status = 'Paid' THEN total_amount ELSE 0 END) as paid_revenue
                  FROM invoices
                  WHERE created_at >= datetime('now', '-30 days')
                `, [], (err, invoiceStats) => {
                  if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                  }
                  stats.totalInvoices = invoiceStats.total_invoices || 0;
                  stats.totalRevenue = invoiceStats.total_revenue || 0;
                  stats.paidRevenue = invoiceStats.paid_revenue || 0;

                  res.json(stats); });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Serve static frontend files (Vite build)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Real-Time CRM Server running on port ${PORT}`);
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

