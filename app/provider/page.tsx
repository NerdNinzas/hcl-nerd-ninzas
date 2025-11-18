"use client";

import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Activity,
  Search,
  Bell,
  Settings,
  BarChart3,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Eye,
  MessageSquare,
  FileText
} from "lucide-react";
import { HealthCard, PatientCard, Alert } from '../components/HealthcareComponents';
import { Navbar } from '../components/Navbar';

export default function ProviderDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'provider') {
    router.push('/auth/signin');
    return null;
  }

  // Use actual provider data from session
  const providerData = {
    name: session.user?.name || "Dr. Provider",
    specialty: "Internal Medicine", // This would come from user profile
    totalPatients: 247,
    todayAppointments: 12,
    pendingReviews: 8
  };

  // Mock patients data
  const patients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 32,
      lastVisit: "2024-11-10",
      nextAppointment: "2024-12-20",
      riskLevel: "low" as const,
      completionRate: 85,
      goals: ["Daily Steps", "Water Intake", "Sleep"],
      status: "active"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 45,
      lastVisit: "2024-11-05",
      nextAppointment: "2024-11-25",
      riskLevel: "medium" as const,
      completionRate: 67,
      goals: ["Blood Pressure", "Medication", "Exercise"],
      status: "needs_attention"
    },
    {
      id: 3,
      name: "Linda Wang",
      age: 28,
      lastVisit: "2024-11-12",
      nextAppointment: "2024-12-15",
      riskLevel: "low" as const,
      completionRate: 92,
      goals: ["Nutrition", "Sleep", "Stress Management"],
      status: "active"
    },
    {
      id: 4,
      name: "Robert Thompson",
      age: 58,
      lastVisit: "2024-10-28",
      nextAppointment: "2024-11-30",
      riskLevel: "high" as const,
      completionRate: 45,
      goals: ["Diabetes Management", "Weight Loss"],
      status: "critical"
    },
    {
      id: 5,
      name: "Maria Garcia",
      age: 36,
      lastVisit: "2024-11-08",
      nextAppointment: "2024-12-10",
      riskLevel: "low" as const,
      completionRate: 78,
      goals: ["Prenatal Care", "Nutrition"],
      status: "active"
    },
    {
      id: 6,
      name: "James Wilson",
      age: 42,
      lastVisit: "2024-11-01",
      nextAppointment: "2024-11-28",
      riskLevel: "medium" as const,
      completionRate: 60,
      goals: ["Cholesterol", "Exercise", "Diet"],
      status: "needs_attention"
    }
  ];

  // Mock appointments for today
  const todayAppointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "09:00 AM",
      type: "Follow-up",
      status: "scheduled"
    },
    {
      id: 2,
      patientName: "Michael Rodriguez",
      time: "10:30 AM",
      type: "Check-up",
      status: "in_progress"
    },
    {
      id: 3,
      patientName: "Linda Wang",
      time: "02:00 PM",
      type: "Consultation",
      status: "scheduled"
    },
    {
      id: 4,
      patientName: "Robert Thompson",
      time: "03:30 PM",
      type: "Urgent Care",
      status: "scheduled"
    }
  ];

  // Mock alerts
  const alerts = [
    {
      type: "error" as const,
      title: "High Priority Patient",
      message: "Robert Thompson has missed 3 consecutive medication reminders",
      icon: AlertTriangle
    },
    {
      type: "warning" as const,
      title: "Appointment Reminder",
      message: "Michael Rodriguez appointment in 30 minutes",
      icon: Clock
    },
    {
      type: "info" as const,
      title: "New Lab Results",
      message: "Lab results available for 3 patients",
      icon: FileText
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar subtitle="Provider Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your patients and track their wellness progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HealthCard
            title="Total Patients"
            value={providerData.totalPatients.toString()}
            icon={Users}
            color="blue"
          />
          <HealthCard
            title="Today's Appointments"
            value={providerData.todayAppointments.toString()}
            icon={Calendar}
            color="green"
          />
          <HealthCard
            title="Pending Reviews"
            value={providerData.pendingReviews.toString()}
            icon={FileText}
            color="yellow"
          />
          <HealthCard
            title="Avg Compliance"
            value="78%"
            subtitle="This month"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Alerts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Priority Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert key={index} {...alert} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Patient List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-900">Patient Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search patients..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="needs_attention">Needs Attention</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPatients.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      name={patient.name}
                      age={patient.age}
                      lastVisit={patient.lastVisit}
                      nextAppointment={patient.nextAppointment}
                      riskLevel={patient.riskLevel}
                      completionRate={patient.completionRate}
                      onClick={() => console.log(`View details for ${patient.name}`)}
                    />
                  ))}
                </div>
                
                {filteredPatients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Schedule</h2>
              
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAppointmentStatus(appointment.status)}`}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                View Full Schedule
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-start p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Plus className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-900">Add New Patient</span>
                </button>
                
                <button className="w-full flex items-center justify-start p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-900">Schedule Appointment</span>
                </button>
                
                <button className="w-full flex items-center justify-start p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-gray-900">Generate Reports</span>
                </button>
                
                <button className="w-full flex items-center justify-start p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MessageSquare className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-gray-900">Message Patients</span>
                </button>
                
                <button className="w-full flex items-center justify-start p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-900">Settings</span>
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">This Month's Performance</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Patient Satisfaction</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Appointment Completion</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium"> 2 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}