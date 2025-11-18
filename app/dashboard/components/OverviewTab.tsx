import {
  Calendar,
  Activity,
  CheckCircle,
  TrendingUp,
  Heart,
  User,
} from 'lucide-react';
import { Appointment, Goal, UserData } from './types';

interface OverviewTabProps {
  appointments: Appointment[];
  goals: Goal[];
  userData: UserData | null;
  onEditProfile: () => void;
}

export function OverviewTab({ appointments, goals, userData, onEditProfile }: OverviewTabProps) {
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 4);
  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed').slice(0, 3);

  // Generate preventive care reminders
  const getPreventiveCareReminders = () => {
    const reminders = [];
    const now = new Date();
    
    // Check for upcoming appointments
    const nextAppointment = appointments.find(a => 
      a.status === 'confirmed' && a.appointmentDate && new Date(a.appointmentDate) > now
    );
    
    if (nextAppointment) {
      reminders.push({
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: `${nextAppointment.provider.name} on ${new Date(nextAppointment.appointmentDate!).toLocaleDateString()}`,
        priority: 'high'
      });
    }
    
    // Check for incomplete goals
    const incompleteGoals = goals.filter(g => g.status === 'active' && g.endDate);
    incompleteGoals.forEach(goal => {
      const daysLeft = Math.ceil((new Date(goal.endDate!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0 && daysLeft <= 7) {
        reminders.push({
          type: 'goal',
          title: 'Goal Deadline Approaching',
          message: `${goal.title} - ${daysLeft} days left`,
          priority: 'medium'
        });
      }
    });
    
    // Health checkup reminder
    if (userData?.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear();
      if (age >= 40) {
        reminders.push({
          type: 'checkup',
          title: 'Annual Physical',
          message: 'Schedule your annual physical examination',
          priority: 'medium'
        });
      }
    }
    
    return reminders.slice(0, 4);
  };

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

  return (
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
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
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
                {activeGoals.map((goal) => {
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

          {/* Profile Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Health Profile</h2>
              <button 
                onClick={onEditProfile}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
            </div>
            
            {userData ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact</label>
                  <p className="text-gray-900">{userData.phoneNumber || 'Not provided'}</p>
                </div>
                
                {userData.medicalInfo?.allergies && userData.medicalInfo.allergies.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allergies</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userData.medicalInfo.allergies.map((allergy, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {userData.medicalInfo?.medications && userData.medicalInfo.medications.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Current Medications</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userData.medicalInfo.medications.map((med, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {userData.medicalInfo?.conditions && userData.medicalInfo.conditions.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Medical Conditions</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userData.medicalInfo.conditions.map((condition, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preventive Care Reminders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reminders</h2>
            
            {getPreventiveCareReminders().length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                <p className="mt-2 text-sm text-gray-500">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getPreventiveCareReminders().map((reminder, idx) => (
                  <div key={idx} className={`p-3 rounded-lg ${
                    reminder.priority === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                    reminder.priority === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                    'bg-blue-50 border-l-4 border-blue-500'
                  }`}>
                    <h4 className="text-sm font-medium text-gray-900">{reminder.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{reminder.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

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

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming</h2>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium text-gray-900">{apt.provider.name}</p>
                    <p className="text-sm text-gray-600">{apt.provider.specialty}</p>
                    {apt.appointmentDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                        {apt.appointmentTime && ` at ${apt.appointmentTime}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
