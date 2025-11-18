"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import {
  User,
  Calendar,
  Activity,
  CheckCircle,
  TrendingUp,
  Heart,
  Search,
  Stethoscope,
  MapPin,
  XCircle,
  X,
  AlertCircle,
  Send
} from 'lucide-react';
import {
  DashboardHeader,
  TabNavigation,
  OverviewTab,
  DoctorsTab,
  AppointmentsTab,
  GoalsTab,
  BookingModal,
  ProfileModal,
  Provider,
  Appointment,
  Goal,
  UserData
} from './components';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'overview');

  useEffect(() => {
    const tab = searchParams?.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    type: 'General Consultation',
    patientNotes: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    phoneNumber: '',
    allergies: '',
    medications: '',
    conditions: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status]);

  useEffect(() => {
    if (session && activeTab === 'doctors') {
      fetchProviders();
    }
    if (session && activeTab === 'appointments') {
      fetchAppointments();
    }
    if (session && activeTab === 'goals') {
      fetchGoals();
    }
    if (session && activeTab === 'overview') {
      fetchGoals();
      fetchAppointments();
    }
  }, [session, activeTab]);

  const fetchUserData = async () => {
    setIsLoadingUser(true);
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const response = await fetch('/api/providers');
      const data = await response.json();
      if (response.ok) {
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (response.ok) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const fetchGoals = async () => {
    setIsLoadingGoals(true);
    try {
      const response = await fetch('/api/goals');
      const data = await response.json();
      if (response.ok) {
        setGoals(data.goals || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const markProgress = async (goalId: string, value: number, note?: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          progressValue: value,
          progressNote: note
        })
      });

      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error marking progress:', error);
    }
  };

  const handleBookAppointment = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowBookingModal(true);
    setBookingError('');
    setBookingSuccess(false);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          providerId: selectedProvider?._id,
          ...bookingData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingData({
          appointmentDate: '',
          appointmentTime: '',
          type: 'General Consultation',
          patientNotes: ''
        });
        fetchAppointments();
      }, 1500);
    } catch (error: any) {
      setBookingError(error.message);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };


  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  const displayName = userData?.name || session.user?.name || "User";
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 4);

  const healthTips = [
    "Stay hydrated by drinking at least 8 glasses of water throughout the day",
    "Take a 10-minute walk after meals to aid digestion and improve circulation",
    "Practice deep breathing for 5 minutes daily to reduce stress and anxiety",
    "Eat colorful fruits and vegetables to ensure you get essential nutrients",
    "Get 7-9 hours of quality sleep each night for optimal health",
    "Limit processed foods and opt for whole, natural ingredients",
    "Take regular breaks from screens to reduce eye strain",
    "Practice good posture to prevent back and neck pain"
  ];
  
  const dailyHealthTip = healthTips[new Date().getDate() % healthTips.length];

  const getGoalColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'cyan': return 'bg-cyan-500';
      case 'purple': return 'bg-purple-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

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

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {displayName.split(' ')[0]}!</h1>
          <p className="mt-2 text-gray-600">Here's your health overview for today</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  router.push('/dashboard');
                }}
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab('doctors');
                  router.push('/dashboard?tab=doctors');
                }}
                className={`${
                  activeTab === 'doctors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Find Doctors
              </button>
              <button
                onClick={() => {
                  setActiveTab('appointments');
                  router.push('/dashboard?tab=appointments');
                }}
                className={`${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Appointments
              </button>
              <button
                onClick={() => {
                  setActiveTab('goals');
                  router.push('/dashboard?tab=goals');
                }}
                className={`${
                  activeTab === 'goals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Goals
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Appointments</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {appointments.filter(a => a.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Active Goals</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {goals.filter(g => g.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Completed Goals</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {goals.filter(g => g.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Progress Rate</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {goals.length > 0 
                        ? Math.round(goals.reduce((acc, g) => acc + ((g.currentValue / g.targetValue) * 100), 0) / goals.length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Wellness Goals Display */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">My Wellness Goals</h2>
                    <button 
                      onClick={() => {
                        setActiveTab('goals');
                        router.push('/dashboard?tab=goals');
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  
                  {activeGoals.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">No active goals yet</p>
                      <p className="text-xs text-gray-400">Your doctor will assign goals for you</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeGoals.map((goal: any) => {
                        const percentage = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
                        return (
                          <div key={goal._id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">{goal.title}</h3>
                              <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {goal.currentValue} / {goal.targetValue} {goal.unit}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('doctors')}
                      className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <Stethoscope className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <span className="text-gray-900 font-medium">Find Doctors</span>
                        <p className="text-xs text-gray-500">Browse and book appointments</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <Calendar className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <span className="text-gray-900 font-medium">My Appointments</span>
                        <p className="text-xs text-gray-500">View upcoming visits</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('goals')}
                      className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <Activity className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <span className="text-gray-900 font-medium">Health Goals</span>
                        <p className="text-xs text-gray-500">Track your progress</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => router.push('/profile')}
                      className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <User className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <span className="text-gray-900 font-medium">My Profile</span>
                        <p className="text-xs text-gray-500">Update health information</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Health Tip of the Day */}
                <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-lg shadow-md p-6 text-white">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Health Tip of the Day</h3>
                      <p className="text-sm opacity-90">{dailyHealthTip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Find Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or specialty..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Doctors List */}
            {isLoadingProviders ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProviders.map((provider) => (
                  <div key={provider._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{provider.specialty}</p>
                        {provider.clinic && (
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {provider.clinic}
                          </p>
                        )}
                        {provider.bio && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{provider.bio}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {provider.maxPatients - provider.currentPatients} slots available
                          </span>
                          <button
                            onClick={() => handleBookAppointment(provider)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {isLoadingAppointments ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments yet</h3>
                <p className="mt-1 text-sm text-gray-500">Book your first appointment with a doctor.</p>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Find Doctors
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.provider.name}</h3>
                          <p className="text-sm text-gray-600">{appointment.provider.specialty}</p>
                          {appointment.provider.clinic && (
                            <p className="text-sm text-gray-500">{appointment.provider.clinic}</p>
                          )}
                          <div className="mt-2 space-y-1">
                            {appointment.appointmentDate && (
                              <p className="text-sm text-gray-600">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                                {appointment.appointmentTime && ` at ${appointment.appointmentTime}`}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              <Activity className="inline w-4 h-4 mr-1" />
                              {appointment.type || 'General Consultation'}
                            </p>
                          </div>
                          {appointment.patientNotes && (
                            <p className="text-sm text-gray-500 mt-2">Note: {appointment.patientNotes}</p>
                          )}
                          {appointment.providerNotes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded">
                              <p className="text-sm text-blue-900">Provider's note: {appointment.providerNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                          <button
                            onClick={() => cancelAppointment(appointment._id)}
                            className="text-red-600 hover:text-red-700 text-sm flex items-center"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            {isLoadingGoals ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : goals.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No goals assigned yet</h3>
                <p className="mt-1 text-sm text-gray-500">Your doctor will assign health goals for you to track.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {goals.map((goal: any) => {
                  const completionPercentage = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
                  const isCompleted = goal.status === 'completed';
                  
                  return (
                    <div key={goal._id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600">
                            Assigned by Dr. {goal.provider?.name}
                          </p>
                          {goal.description && (
                            <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isCompleted ? 'Completed' : goal.frequency}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                          <span className="font-medium text-gray-900">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {goal.endDate && (
                        <p className="text-xs text-gray-500 mb-3">
                          Target date: {new Date(goal.endDate).toLocaleDateString()}
                        </p>
                      )}

                      {!isCompleted && (
                        <div className="flex items-center space-x-3">
                          <input
                            type="number"
                            placeholder={`Add ${goal.unit}...`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                            id={`progress-${goal._id}`}
                            min="0"
                            step="any"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`progress-${goal._id}`) as HTMLInputElement;
                              const value = parseFloat(input.value);
                              if (value && value > 0) {
                                markProgress(goal._id, value);
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Mark Progress
                          </button>
                        </div>
                      )}

                      {/* Recent Progress */}
                      {goal.progress && goal.progress.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Progress</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {goal.progress.slice(-5).reverse().map((p: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  +{p.value} {goal.unit}
                                  {p.note && ` - ${p.note}`}
                                </span>
                                <span className="text-gray-400">
                                  {new Date(p.date).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Book Appointment</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedProvider.name}</p>
              <p className="text-sm text-gray-600">{selectedProvider.specialty}</p>
            </div>

            {bookingSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <p className="ml-2 text-sm text-green-800">Appointment request sent!</p>
                </div>
              </div>
            )}

            {bookingError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-2 text-sm text-red-800">{bookingError}</p>
                </div>
              </div>
            )}

            <form onSubmit={submitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  value={bookingData.appointmentDate}
                  onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={bookingData.appointmentTime}
                  onChange={(e) => setBookingData({ ...bookingData, appointmentTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={bookingData.type}
                  onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                >
                  <option>General Consultation</option>
                  <option>Follow-up</option>
                  <option>Check-up</option>
                  <option>Urgent Care</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Any specific concerns or symptoms..."
                  value={bookingData.patientNotes}
                  onChange={(e) => setBookingData({ ...bookingData, patientNotes: e.target.value })}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}