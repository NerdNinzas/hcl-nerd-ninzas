import { X, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Provider } from './types';

interface BookingData {
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  patientNotes: string;
}

interface BookingModalProps {
  isOpen: boolean;
  provider: Provider | null;
  bookingData: BookingData;
  onBookingDataChange: (data: BookingData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error: string;
  success: boolean;
}

export function BookingModal({ 
  isOpen, 
  provider, 
  bookingData, 
  onBookingDataChange, 
  onSubmit, 
  onClose, 
  error, 
  success 
}: BookingModalProps) {
  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Book Appointment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-900">{provider.name}</p>
          <p className="text-sm text-gray-600">{provider.specialty}</p>
        </div>

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-2 text-sm text-green-800">Appointment request sent!</p>
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
              Preferred Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={bookingData.appointmentDate}
              onChange={(e) => onBookingDataChange({ ...bookingData, appointmentDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time
            </label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={bookingData.appointmentTime}
              onChange={(e) => onBookingDataChange({ ...bookingData, appointmentTime: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={bookingData.type}
              onChange={(e) => onBookingDataChange({ ...bookingData, type: e.target.value })}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any specific concerns or symptoms..."
              value={bookingData.patientNotes}
              onChange={(e) => onBookingDataChange({ ...bookingData, patientNotes: e.target.value })}
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
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
  );
}
