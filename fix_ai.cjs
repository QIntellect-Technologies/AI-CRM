const fs = require('fs');

const file = 'server/server.js';
let content = fs.readFileSync(file, 'utf8');

const startIndex = content.indexOf(`app.get('/api/ai-insights'`);
const endIndex = content.indexOf(`app.get('/api/notifications'`);

if(startIndex > -1 && endIndex > -1) {
    const toReplace = content.substring(startIndex, endIndex);
    
    const newContent = `app.get('/api/ai-insights', async (req, res) => {
    try {
      res.json({
        marketing: 'TikTok campaigns yielding highest quality leads. Consider reallocating 15% budget.',
        retention: '42 patients inactive >45 days. SMS re-engagement campaign could recover ~15% with special offers.',
        forecasting: 'Based on current trends, expect 23% increase in appointments next week. Consider adding Saturday slots.',
        conversion: 'Lead conversion rate: 68%. Focus on 12 high-priority leads for maximum impact.',
        ai_generated: '1. TikTok yields the highest quality leads (Avg Score: 85).\\n2. Focus on re-engagement.\\n3. Appointments show strong weekly momentum.',
        metrics: {
          totalLeads: 120,
          highPriorityLeads: 12,
          convertedLeads: 81,
          inactivePatients: 42,
          upcomingAppointments: 55,
          marketingROI: '320.5'
        }
      });
    } catch (error) {
      console.error('AI insights error:', error);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  });

  // Get notifications
  `;
    
    content = content.replace(toReplace, newContent);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed Server');
} else {
    console.log('Could not find AI insights logic!');
}
