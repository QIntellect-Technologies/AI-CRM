# AI-CRM-DASHBOARD - Real-Time Healthcare CRM System

## 🎯 Overview
A complete AI-powered Customer Relationship Management system for healthcare clinics with real-time data, manual data entry, and automated insights.

## ✨ Features
- **Real-Time Dashboard**: Live KPI tracking with auto-refresh every 30 seconds
- **Lead Management**: AI-scored leads with manual entry and conversion tracking
- **Patient Records**: Complete patient management with appointment history
- **Call Center Monitoring**: Agent status and performance tracking
- **Marketing Analytics**: Campaign performance and ROI analysis
- **AI Insights**: Google Gemini-powered recommendations and forecasting
- **Manual Data Entry**: Add leads, patients, and appointments through the UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database with Sample Data**
   ```bash
   cd server
   node initDb.js
   cd ..
   ```

3. **Start the Application**
   ```bash
   # Terminal 1: Start Backend Server
   npm run server

   # Terminal 2: Start Frontend
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3003
   - Backend API: http://localhost:5000

## 📊 Adding Real-Time Data

The system comes pre-populated with 100+ sample records. To add more data manually:

### Option 1: Run the Batch Script
```bash
# Windows
add-data.bat

# Or manually:
cd server
node addRealtimeData.js
```

### Option 2: Use the Web Interface
- Navigate to the **Leads** or **Patients** sections
- Click **"Add New"** buttons to manually enter data
- Data is immediately saved to the database and reflected in real-time

### Option 3: Direct Database Access
```bash
cd server
sqlite3 database.db
```

## 🗄️ Database Schema

### Tables
- **leads**: Customer leads with AI scoring (120+ records)
- **patients**: Patient records and visit history (80+ records)
- **appointments**: Scheduled appointments (50+ records)
- **call_agents**: Call center agent status (12 records)
- **marketing_campaigns**: Marketing performance data (30+ records)
- **notifications**: System notifications (25+ records)

### Sample Data Included
- **120 Leads**: Recent entries from last 30 days with AI scores
- **80 Patients**: Active patients with realistic visit history
- **50 Appointments**: Scheduled for +/- 7 days from today
- **12 Call Agents**: With realistic call statistics and status
- **30 Marketing Records**: Performance data across multiple platforms
- **25 Notifications**: System alerts and updates

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Real-time statistics

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Add new lead

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add new patient

### Appointments
- `GET /api/appointments` - Get all appointments

### Call Center
- `GET /api/call-agents` - Get agent status

### Marketing
- `GET /api/marketing` - Get campaign data

### AI Insights
- `GET /api/ai-insights` - Get AI recommendations

## 🤖 AI Integration

The system uses Google Gemini API for:
- **Lead Scoring**: Automatic quality assessment (1-100)
- **Business Insights**: Marketing optimization recommendations
- **Patient Retention**: Churn prediction and strategies
- **Sales Forecasting**: Revenue prediction and trends

*Note: Add your Google Gemini API key to `server/server.js` for full AI functionality*

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effects
- **Real-Time Updates**: Auto-refreshing dashboard
- **Responsive Layout**: Works on all device sizes
- **Dark Theme**: Healthcare-focused navy color scheme
- **Interactive Charts**: Recharts-powered analytics
- **Glow Effects**: Custom CSS animations and shadows

## 🛠️ Development

### Project Structure
```
├── src/
│   ├── components/     # Reusable UI components
│   ├── views/         # Page components
│   ├── services/      # API client
│   └── lib/           # Utilities
├── server/
│   ├── server.js      # Express API server
│   ├── initDb.js      # Database initialization
│   └── addRealtimeData.js # Manual data addition
├── add-data.bat       # Windows batch script for adding data
└── database.db        # SQLite database
```

### Technologies Used
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, SQLite
- **AI**: Google Gemini API
- **Charts**: Recharts
- **Icons**: Lucide React

## 📈 Dashboard Metrics

The dashboard displays:
- **Today's Leads**: New customer inquiries (from database)
- **Active Patients**: Currently engaged patients
- **Today's Appointments**: Scheduled visits
- **Call Center Status**: Agent availability and calls handled

All metrics update in real-time and reflect actual database changes.

## 🔄 Real-Time Functionality

- **Auto-Refresh**: Dashboard updates every 30 seconds
- **Live Data**: All changes immediately reflected
- **Manual Entry**: Add data through UI forms
- **Batch Import**: Run scripts to add bulk data
- **Database Persistence**: All data saved to SQLite database

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify database connection
3. Ensure ports 3003 (frontend) and 5000 (backend) are available
4. Check API key configuration for AI features

---

**🎉 Your AI-CRM Dashboard is now ready for healthcare clinic management with real data!**
