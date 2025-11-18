import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface HealthCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo';
  onClick?: () => void;
}

export function HealthCard({ title, value, subtitle, icon: Icon, color, onClick }: HealthCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  current: number;
  target: number;
  color: string;
  label: string;
  unit: string;
}

export function ProgressBar({ current, target, color, label, unit }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{current} / {target} {unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getColorClass(color)} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right">
        <span className="text-sm font-medium text-gray-600">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

interface AlertProps {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  icon: LucideIcon;
}

export function Alert({ type, title, message, icon: Icon }: AlertProps) {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconClasses = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    error: 'text-red-600'
  };

  return (
    <div className={`border rounded-lg p-4 ${typeClasses[type]}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-6 h-6 ${iconClasses[type]} mt-0.5`} />
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface ReminderCardProps {
  type: string;
  date: string;
  provider: string;
  priority: 'high' | 'medium' | 'low';
  onClick?: () => void;
}

export function ReminderCard({ type, date, provider, priority, onClick }: ReminderCardProps) {
  const priorityClasses = {
    high: 'text-red-600 bg-red-100 border-red-200',
    medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    low: 'text-green-600 bg-green-100 border-green-200'
  };

  const borderClasses = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500'
  };

  return (
    <div 
      className={`border-l-4 ${borderClasses[priority]} pl-4 py-3 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{type}</h3>
          <p className="text-sm text-gray-500">{provider}</p>
          <p className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityClasses[priority]}`}>
          {priority}
        </span>
      </div>
    </div>
  );
}

interface PatientCardProps {
  name: string;
  age: number;
  lastVisit: string;
  nextAppointment?: string;
  riskLevel: 'low' | 'medium' | 'high';
  completionRate: number;
  onClick?: () => void;
}

export function PatientCard({ name, age, lastVisit, nextAppointment, riskLevel, completionRate, onClick }: PatientCardProps) {
  const riskColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">Age: {age}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColors[riskLevel]}`}>
          {riskLevel} risk
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Last Visit:</span>
          <span>{new Date(lastVisit).toLocaleDateString()}</span>
        </div>
        {nextAppointment && (
          <div className="flex justify-between">
            <span>Next Appointment:</span>
            <span>{new Date(nextAppointment).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Compliance Rate:</span>
          <span className="font-medium">{completionRate}%</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}