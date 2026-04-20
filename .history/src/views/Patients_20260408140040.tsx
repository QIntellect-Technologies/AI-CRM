import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  Search,
  Filter,
  UserPlus,
  Calendar,
  AlertCircle,
  ChevronRight,
  Activity,
  X,
  Star,
  Phone,
} from "lucide-react";
import { cn, getAvatarUrl } from "../lib/utils";

export function Patients({
  onPatientSelect,
}: {
  onPatientSelect?: (id: number | string) => void;
}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [inactiveFilter, setInactiveFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addPatient(formData);
      setFormData({ name: "", phone: "", dob: "" });
      setShowAddForm(false);
      fetchPatients(); // Refresh data
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const filteredPatients = patients.filter((patient: any) => {
    // 1. Search filter
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    // 2. Timeframe logic & Inactive status logic
    let matchesTimeframe = true;
    let matchesInactive = true;

    if (patient.last_visit && patient.last_visit !== "Never") {
      const lastVisit = new Date(patient.last_visit);
      if (!isNaN(lastVisit.getTime())) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
        const daysSinceLastVisit = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // First Dropdown: Timeframe visited
        if (timeframeFilter === "last_week")
          matchesTimeframe = daysSinceLastVisit <= 7;
        else if (timeframeFilter === "last_10_days")
          matchesTimeframe = daysSinceLastVisit <= 10;
        else if (timeframeFilter === "last_20_days")
          matchesTimeframe = daysSinceLastVisit <= 20;
        else if (timeframeFilter === "last_month")
          matchesTimeframe = daysSinceLastVisit <= 30;

        // Second Dropdown: Inactive status
        if (inactiveFilter === "inactive_last_month")
          matchesInactive = daysSinceLastVisit > 30;
        else if (inactiveFilter === "inactive_30_45")
          matchesInactive =
            daysSinceLastVisit >= 30 && daysSinceLastVisit <= 45;
      }
    }

    return matchesTimeframe && matchesInactive;
  });

  const stats = {
    total: patients.length,
    active: patients.filter((p: any) => p.status === "Active").length,
    inactive: patients.filter((p: any) => p.status === "Inactive").length,
    highValue: patients.filter((p: any) => (p.total_visits || 0) >= 10).length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-navy-900 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-glow" /> Add New Patient
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow focus:outline-none transition-all"
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow focus:outline-none transition-all"
                    placeholder="+971 50 123 4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow focus:outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:-translate-y-0.5 transition-all font-medium cursor-pointer z-10"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Header & KPIs */}
      <div className="sticky top-[96px] z-[50] bg-navy-950/90 backdrop-blur-2xl pb-4 pt-4 -mx-8 px-8 rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-b border-light-blue/10 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Patient Management
            </h1>
            <p className="text-gray-400 mt-1">
              View and manage patient records, history, and engagement.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            <UserPlus size={18} />
            Add Patient
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-cyan-glow/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glow/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-cyan-glow/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Total Patients
                </p>
                <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-glow/20 flex items-center justify-center text-cyan-glow shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <UserPlus size={20} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Active Patients
                </p>
                <h3 className="text-3xl font-bold text-white">
                  {stats.active}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Activity size={20} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-red-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Inactive Patients
                </p>
                <h3 className="text-3xl font-bold text-white">
                  {stats.inactive}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <AlertCircle size={20} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-amber-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Gold Tier (High Value)
                </p>
                <h3 className="text-3xl font-bold text-white">
                  {stats.highValue}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Star size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-cyan-glow">Loading patients...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search patients by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-input rounded-lg text-sm transition-all focus:border-cyan-glow"
              />
            </div>

            <div className="flex w-full md:w-auto items-center gap-3">
              {/* Timeframe Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  className="px-3 py-2 glass-input rounded-lg text-sm text-gray-300 outline-none focus:border-cyan-glow cursor-pointer"
                  value={timeframeFilter}
                  onChange={(e) => setTimeframeFilter(e.target.value)}
                >
                  <option value="all">Visited: All Time</option>
                  <option value="last_week">Visited: Last Week</option>
                  <option value="last_10_days">Visited: Last 10 Days</option>
                  <option value="last_20_days">Visited: Last 20 Days</option>
                  <option value="last_month">Visited: Last Month</option>
                </select>
              </div>

              {/* Inactive Filter */}
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400/70" />
                <select
                  className="px-3 py-2 glass-input rounded-lg text-sm text-gray-300 outline-none focus:border-cyan-glow cursor-pointer"
                  value={inactiveFilter}
                  onChange={(e) => setInactiveFilter(e.target.value)}
                >
                  <option value="all">Status: All Patients</option>
                  <option value="inactive_last_month">
                    Inactive: Last Month
                  </option>
                  <option value="inactive_30_45">Inactive: 30-45 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm font-medium text-gray-400">
            Showing{" "}
            <span className="text-white">{filteredPatients.length}</span>{" "}
            patient{filteredPatients.length !== 1 && "s"}
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="glass-table w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left">Patient Name</th>
                    <th className="px-6 py-4 text-left">Contact</th>
                    <th className="px-6 py-4 text-left">Last Visit</th>
                    <th className="px-6 py-4 text-left">Loyalty Tier</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Total Visits</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPatients.map((patient: any, i: number) => (
                    <tr
                      key={patient.id}
                      className="glass-table-row group cursor-pointer"
                      onClick={() =>
                        onPatientSelect && onPatientSelect(patient.id)
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatarUrl(patient.name, patient.id)}
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-medium text-white">
                              {patient.name}
                            </div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">
                              DOB: {patient.dob}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300 font-mono">
                          <Calendar size={14} className="text-gray-500" />
                          {patient.last_visit || "Never"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                            (patient.total_visits || 0) >= 10
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : (patient.total_visits || 0) >= 5
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/20",
                          )}
                        >
                          {(patient.total_visits || 0) >= 10 ? (
                            <Star size={12} className="fill-current" />
                          ) : null}
                          {(patient.total_visits || 0) >= 10
                            ? "Gold"
                            : (patient.total_visits || 0) >= 5
                              ? "Silver"
                              : "Bronze"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                            patient.status === "Active"
                              ? "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20",
                          )}
                        >
                          {patient.status === "Inactive" && (
                            <AlertCircle size={12} />
                          )}
                          {patient.status === "Active" && (
                            <Activity size={12} />
                          )}
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono">
                        {patient.total_visits}
                      </td>
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
        </>
      )}
    </div>
  );
}
