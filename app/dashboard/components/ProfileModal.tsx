import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileData {
  phoneNumber: string;
  allergies: string;
  medications: string;
  conditions: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  profileData: ProfileData;
  onProfileDataChange: (data: ProfileData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error: string;
  success: boolean;
}

export function ProfileModal({ 
  isOpen, 
  profileData, 
  onProfileDataChange, 
  onSubmit, 
  onClose, 
  error, 
  success 
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Edit Health Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-2 text-sm text-green-800">Profile updated successfully!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-2 text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+1 234 567 8900"
              value={profileData.phoneNumber}
              onChange={(e) => onProfileDataChange({ ...profileData, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <AlertCircle className="inline w-4 h-4 mr-1 text-red-500" />
              Allergies
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Penicillin, Peanuts (comma separated)"
              value={profileData.allergies}
              onChange={(e) => onProfileDataChange({ ...profileData, allergies: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Medications
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Aspirin, Metformin (comma separated)"
              value={profileData.medications}
              onChange={(e) => onProfileDataChange({ ...profileData, medications: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical Conditions
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Diabetes, Hypertension (comma separated)"
              value={profileData.conditions}
              onChange={(e) => onProfileDataChange({ ...profileData, conditions: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
