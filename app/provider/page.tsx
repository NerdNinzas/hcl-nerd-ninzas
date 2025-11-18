"use client";

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  FileText,
  Check,
  X,
  User as UserIcon,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import { Navbar } from '../components/Navbar';

interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
  };
  appointmentDate?: string;
  appointmentTime?: string;
  status: string;
  type?: string;
  patientNotes?: string;
  providerNotes?: string;
  createdAt: string;
}

export default function ProviderDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [providerNotes, setProviderNotes] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'appointments');

  useEffect(() => {
    const tab = searchParams?.get('tab') || 'appointments';
    setActiveTab(tab);
  }, [searchParams]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    targetValue: '',
    unit: '',
    frequency: 'daily',
    endDate: ''
  });
  const [goalError, setGoalError] = useState('');
  const [goalSuccess, setGoalSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (status === 'authenticated' && session?.user?.role !== 'provider') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'provider') {
      fetchAppointments();
      fetchPatients();
    }
  }, [session]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      if (response.ok) {
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (response.ok) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          providerNotes: providerNotes[appointmentId] || ''
        })
      });

      if (response.ok) {
        fetchAppointments();
        fetchPatients();
        setProviderNotes({ ...providerNotes, [appointmentId]: '' });
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleAssignGoal = (patient: any) => {
    setSelectedPatient(patient);
    setShowGoalModal(true);
    setGoalError('');
    setGoalSuccess(false);
  };

  const submitGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoalError('');
    
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          title: goalData.title,
          description: goalData.description,
          targetValue: parseFloat(goalData.targetValue),
          unit: goalData.unit,
          frequency: goalData.frequency,
          endDate: goalData.endDate || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign goal');
      }

      setGoalSuccess(true);
      setTimeout(() => {
        setShowGoalModal(false);
        setGoalData({
          title: '',
          description: '',
          targetValue: '',
          unit: '',
          frequency: 'daily',
          endDate: ''
        });
      }, 1500);
    } catch (error: any) {
      setGoalError(error.message);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'provider') return null;

  const providerData = {
    name: session.user?.name || "Dr. Provider",
    totalPatients: appointments.filter(a => a.status === 'confirmed').length,
    pendingRequests: appointments.filter(a => a.status === 'pending').length,
    todayAppointments: appointments.filter(a => {
      if (!a.appointmentDate) return false;
      const today = new Date().toISOString().split('T')[0];
      return a.appointmentDate.split('T')[0] === today && a.status === 'confirmed';
    }).length
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'all') return true;
    return appointment.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar subtitle="Provider Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your patients and appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Patients</p>
                <p className="text-lg font-semibold text-gray-900">{providerData.totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-lg font-semibold text-gray-900">{providerData.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Today's Appointments</p>
                <p className="text-lg font-semibold text-gray-900">{providerData.todayAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-lg font-semibold text-gray-900">{appointments.filter(a => a.status === 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('appointments');
                  router.push('/provider');
                }}
                className={`${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Appointment Requests
              </button>
              <button
                onClick={() => {
                  setActiveTab('patients');
                  router.push('/provider?tab=patients');
                }}
                className={`${
                  activeTab === 'patients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Patients
              </button>
            </nav>
          </div>
        </div>

        {/* Pending Requests Alert */}
        {pendingAppointments.length > 0 && activeTab === 'appointments' && (
          <div className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You have <strong>{pendingAppointments.length}</strong> pending appointment request(s) that need your attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-gray-900">Appointment Requests</h2>
                <select
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus === 'all' 
                    ? 'You have no appointments yet.' 
                    : `No ${filterStatus} appointments.`}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className={`border rounded-lg p-6 ${
                      appointment.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      {/* Patient Info */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.patient.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {appointment.patient.email}
                            </p>
                            {appointment.patient.phoneNumber && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                {appointment.patient.phoneNumber}
                              </p>
                            )}
                            {appointment.appointmentDate && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                                {appointment.appointmentTime && ` at ${appointment.appointmentTime}`}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 flex items-center">
                              <Activity className="w-4 h-4 mr-2" />
                              {appointment.type || 'General Consultation'}
                            </p>
                          </div>

                          {appointment.patientNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-700 mb-1">Patient's Notes:</p>
                              <p className="text-sm text-gray-800">{appointment.patientNotes}</p>
                            </div>
                          )}

                          {appointment.providerNotes && appointment.status !== 'pending' && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs font-medium text-blue-700 mb-1">Your Notes:</p>
                              <p className="text-sm text-blue-900">{appointment.providerNotes}</p>
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mt-2">
                            Requested on {new Date(appointment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {appointment.status === 'pending' && (
                        <div className="lg:ml-4 space-y-3 lg:w-64">
                          <textarea
                            rows={3}
                            placeholder="Add notes (optional)..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={providerNotes[appointment._id] || ''}
                            onChange={(e) => setProviderNotes({ ...providerNotes, [appointment._id]: e.target.value })}
                          />
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAppointmentAction(appointment._id, 'confirmed')}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleAppointmentAction(appointment._id, 'rejected')}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {appointment.status === 'confirmed' && (
                        <div className="lg:ml-4">
                          <button
                            onClick={() => handleAppointmentAction(appointment._id, 'completed')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Completed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">My Patients</h2>
            </div>

            <div className="p-6">
              {patients.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No patients yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Patients will appear here once you confirm their appointments.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {patients.map((patient: any) => (
                    <div key={patient._id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {patient.email}
                            </p>
                            {patient.phoneNumber && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                {patient.phoneNumber}
                              </p>
                            )}
                            {patient.dateOfBirth && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                              </p>
                            )}
                          </div>
                          {patient.medicalInfo && (
                            <div className="mt-3 space-y-1">
                              {patient.medicalInfo.conditions && patient.medicalInfo.conditions.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  Conditions: {patient.medicalInfo.conditions.join(', ')}
                                </p>
                              )}
                              {patient.medicalInfo.allergies && patient.medicalInfo.allergies.length > 0 && (
                                <p className="text-xs text-red-500">
                                  Allergies: {patient.medicalInfo.allergies.join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                          <button
                            onClick={() => handleAssignGoal(patient)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Assign Goal
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Goal Assignment Modal */}
      {showGoalModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Assign Goal</h3>
              <button
                onClick={() => setShowGoalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedPatient.name}</p>
              <p className="text-sm text-gray-600">{selectedPatient.email}</p>
            </div>

            {goalSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <p className="ml-2 text-sm text-green-800">Goal assigned successfully!</p>
                </div>
              </div>
            )}

            {goalError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-2 text-sm text-red-800">{goalError}</p>
                </div>
              </div>
            )}

            <form onSubmit={submitGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Daily Steps, Water Intake"
                  value={goalData.title}
                  onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional details about the goal..."
                  value={goalData.description}
                  onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                    value={goalData.targetValue}
                    onChange={(e) => setGoalData({ ...goalData, targetValue: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="steps, glasses, hours"
                    value={goalData.unit}
                    onChange={(e) => setGoalData({ ...goalData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={goalData.frequency}
                  onChange={(e) => setGoalData({ ...goalData, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  value={goalData.endDate}
                  onChange={(e) => setGoalData({ ...goalData, endDate: e.target.value })}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Assign Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
