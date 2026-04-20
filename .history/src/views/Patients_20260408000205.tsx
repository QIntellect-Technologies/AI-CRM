import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Filter, UserPlus, Calendar, AlertCircle, ChevronRight, Activity, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addPatient(formData);
      setFormData({ name: '', phone: '', dob: '' });
      setShowAddForm(false);
      fetchPatients(); // Refresh data
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-white">Add New Patient</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-navy-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-glow focus:outline-none"
                  placeholder="Enter patient name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-navy-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-glow focus:outline-none"
                  placeholder="+971 50 123 4567"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-3 py-2 bg-navy-900 border border-white/10 rounded-lg text-white focus:border-cyan-glow focus:outline-none"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-glow text-white rounded-lg hover:bg-cyan-glow/90 transition-colors"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Patient Management</h1>
          <p className="text-sm text-gray-400 mt-1">View and manage patient records, history, and engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 rounded-lg text-sm font-medium hover:bg-cyan-glow/20 transition-all shadow-[0_0_15px_rgba(0,212,255,0.15)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <UserPlus size={16} />
            Add Patient
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search patients by name or phone..." 
            className="w-full pl-10 pr-4 py-2 glass-input rounded-lg text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass-input rounded-lg text-sm font-medium hover:bg-navy-900/80 transition-all">
          <Filter size={16} className="text-gray-400" />
          Filters
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="glass-table">
            <thead>
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Visits</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {patients.map((patient, i) => (
                <tr key={patient.id} className="glass-table-row group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/patient${i}/100/100`} alt={patient.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div>
                        <div className="font-medium text-white">{patient.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">DOB: {patient.dob}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{patient.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300 font-mono">
                      <Calendar size={14} className="text-gray-500" />
                      {patient.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                      patient.status === 'Active' ? "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {patient.status === 'Inactive' && <AlertCircle size={12} />}
                      {patient.status === 'Active' && <Activity size={12} />}
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{patient.totalVisits}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs font-bold uppercase tracking-wider text-cyan-glow hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        View <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
