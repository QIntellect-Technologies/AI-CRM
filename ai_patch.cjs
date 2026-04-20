const fs = require('fs');

let serverCode = fs.readFileSync('server/server.js', 'utf8');

const faultyPromiseAll = `      const [leadsData, patientsData, appointmentsData, marketingData, monthlyStats] = await Promise.all([
        new Promise((resolve, reject) => {
          db.all('SELECT * FROM leads WHERE created_at >= date("now", "-30 days")', [], (err, rows) => {
          if (err) reject(err); else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        db.all('SELECT * FROM marketing_campaigns WHERE date >= date("now", "-30 days")', [], (err, rows) => {
          if (err) reject(err); else resolve(rows);
        });
      })
    ]);`;

const correctPromiseAll = `      const [leadsData, marketingData, patientsData, appointmentsData] = await Promise.all([
        new Promise((resolve, reject) => {
          db.all('SELECT * FROM leads WHERE created_at >= date("now", "-30 days")', [], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      }),
      new Promise((resolve, reject) => {
        db.all('SELECT * FROM marketing_campaigns WHERE date >= date("now", "-30 days")', [], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      }),
      new Promise((resolve, reject) => {
        db.all('SELECT * FROM patients', [], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      }),
      new Promise((resolve, reject) => {
        db.all('SELECT * FROM appointments', [], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      })
    ]);`;

serverCode = serverCode.replace(faultyPromiseAll, correctPromiseAll);
fs.writeFileSync('server/server.js', serverCode, 'utf8');
console.log('Patched server ai-insights Promise');
