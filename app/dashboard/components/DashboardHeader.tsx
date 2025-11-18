import { User } from 'lucide-react';
import { UserData } from './types';

interface DashboardHeaderProps {
  displayName: string;
  onEditProfile: () => void;
}

export function DashboardHeader({ displayName, onEditProfile }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {displayName.split(' ')[0]}!</h1>
        <p className="mt-2 text-gray-600">Here's your health overview for today</p>
      </div>
      <button
        onClick={onEditProfile}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <User className="w-4 h-4 mr-2" />
        Edit Profile
      </button>
    </div>
  );
}
