"use client";

import { useState } from "react";
import { 
  Heart, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Activity,
  Target,
  Bell,
  User,
  Settings,
  LogOut,
  Droplets,
  Footprints,
  Moon,
  Utensils,
  AlertCircle,
  Award,
  BarChart3,
  Plus
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const userData = {
    name: "Sarah Johnson",
    age: 32,
    lastCheckup: "2024-10-15",
    nextAppointment: "2024-12-20",
    riskLevel: "Low"
  };

  // Mock health goals data
  const healthGoals = [
    {
      id: 1,
      title: "Daily Steps",
      current: 8420,
      target: 10000,
      unit: "steps",
      icon: <Footprints className="w-5 h-5" />,
      color: "blue",
      percentage: 84
    },
    {
      id: 2,
      title: "Water Intake",
      current: 6,
      target: 8,
      unit: "glasses",
      icon: <Droplets className="w-5 h-5" />,
      color: "cyan",
      percentage: 75
    },
    {
      id: 3,
      title: "Sleep Hours",
      current: 7.5,
      target: 8,
      unit: "hours",
      icon: <Moon className="w-5 h-5" />,
      color: "purple",
      percentage: 94
    },
    {
      id: 4,
      title: "Healthy Meals",
      current: 2,
      target: 3,
      unit: "meals",
      icon: <Utensils className="w-5 h-5" />,
      color: "green",
      percentage: 67
    }
  ];

  // Mock reminders data
  const upcomingReminders = [
    {
      id: 1,
      type: "Annual Physical",
      date: "2024-12-20",
      provider: "Dr. Smith",
      priority: "high"
    },
    {
      id: 2,
      type: "Blood Pressure Check",
      date: "2024-12-15",
      provider: "Nurse Practitioner",
      priority: "medium"
    },
    {
      id: 3,
      type: "Dental Cleaning",
      date: "2024-12-28",
      provider: "Dr. Wilson",
      priority: "low"
    },
    {
      id: 4,
      type: "Eye Exam",
      date: "2025-01-10",
      provider: "Dr. Johnson",
      priority: "medium"
    }
  ];

  // Mock health tips
  const dailyTips = [
    "Stay hydrated by drinking water throughout the day",
    "Take a 10-minute walk after meals to aid digestion",
    "Practice deep breathing for 5 minutes to reduce stress",
    "Eat colorful fruits and vegetables for essential nutrients"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGoalColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'cyan': return 'bg-cyan-500';
      case 'purple': return 'bg-purple-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HealthCare Portal</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">SJ</span>
                </div>
                <span className="text-gray-700 font-medium">{userData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData.name.split(' ')[0]}!</h1>
          <p className="mt-2 text-gray-600">Here's your health overview for today</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Next Appointment</p>
                <p className="text-lg font-semibold text-gray-900">Dec 20</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Goals Completed</p>
                <p className="text-lg font-semibold text-gray-900">3 of 4</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Health Score</p>
                <p className="text-lg font-semibold text-gray-900">85/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Streak</p>
                <p className="text-lg font-semibold text-gray-900">12 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Goals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Health Goals</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Goal
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthGoals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${getGoalColor(goal.color).replace('bg-', 'bg-')} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                          <div className={`${getGoalColor(goal.color).replace('bg-', 'text-')}`}>
                            {goal.icon}
                          </div>
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-500">{goal.current} / {goal.target} {goal.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{goal.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getGoalColor(goal.color)}`}
                        style={{ width: `${goal.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Insights</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Great progress on your sleep goal!</h3>
                    <p className="text-sm text-green-700">You've maintained 7+ hours of sleep for 5 consecutive days.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Reminder: Stay hydrated</h3>
                    <p className="text-sm text-yellow-700">You're 2 glasses behind your daily water intake goal.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Award className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Achievement unlocked!</h3>
                    <p className="text-sm text-blue-700">You've reached your step goal 10 times this month.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Reminders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Reminders</h2>
              
              <div className="space-y-4">
                {upcomingReminders.slice(0, 4).map((reminder) => (
                  <div key={reminder.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{reminder.type}</h3>
                        <p className="text-sm text-gray-500">{reminder.provider}</p>
                        <p className="text-sm text-gray-500">{reminder.date}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Reminders
              </button>
            </div>

            {/* Daily Health Tip */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Health Tip</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Today's Tip</h3>
                    <p className="text-sm text-gray-700">{dailyTips[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-900">Schedule Appointment</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-900">View Health Reports</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-900">Update Profile</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}