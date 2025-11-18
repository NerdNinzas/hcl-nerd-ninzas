import { Calendar, Stethoscope, Activity, XCircle, MapPin } from 'lucide-react';
import { Appointment } from './types';

interface AppointmentsTabProps {
  appointments: Appointment[];
  isLoading: boolean;
  onCancelAppointment: (id: string) => void;
  onFindDoctors: () => void;
}

export function AppointmentsTab({ 
  appointments, 
  isLoading, 
  onCancelAppointment, 
  onFindDoctors 
}: AppointmentsTabProps) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments yet</h3>
        <p className="mt-1 text-sm text-gray-500">Book your first appointment with a doctor.</p>
        <button
          onClick={onFindDoctors}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Find Doctors
        </button>
      </div>
    );
  }

  return (
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
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {appointment.provider.clinic}
                  </p>
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
                  onClick={() => onCancelAppointment(appointment._id)}
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
  );
}
