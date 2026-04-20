import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('database.db');
db.serialize(() => {
  db.run('DELETE FROM automated_workflows');
  const stmt = db.prepare('INSERT INTO automated_workflows (name, trigger_type, conditions, actions, is_active) VALUES (?, ?, ?, ?, ?)');
  const workflows = [
    ['Lead Assignment', 'lead_created', '{"source": "social_media"}', '[{"type": "notification", "channel": "system", "message": "New lead from social media"}, {"type": "assignment", "method": "round_robin"}]', 1],
    ['Appointment Reminder', 'appointment_scheduled', '{"advance_notice": "24h"}', '[{"type": "sms", "template": "appointment_reminder"}, {"type": "email", "template": "appointment_confirmation"}]', 1],
    ['Patient Re-engagement', 'patient_inactive', '{"days_inactive": "30"}', '[{"type": "sms", "template": "reengagement_offer"}, {"type": "email", "template": "loyalty_program"}]', 1],
    ['Lead Follow-up Ping', 'lead_followup_due', '{"priority": "high"}', '[{"type": "notification", "channel": "agent", "message": "Follow-up due for high-priority lead"}]', 1],
    ['Post-Appointment Survey', 'appointment_completed', '{}', '[{"type": "sms", "template": "feedback_request"}, {"type": "notification", "channel": "system", "message": "Appointment completed - schedule follow-up"}]', 1]
  ];
  workflows.forEach(w => stmt.run(w));
  stmt.finalize();
  console.log('Fixed Workflows!');
});
db.close();
