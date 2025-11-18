import { Search, Stethoscope, User, MapPin } from 'lucide-react';
import { Provider } from './types';

interface DoctorsTabProps {
  providers: Provider[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onBookAppointment: (provider: Provider) => void;
}

export function DoctorsTab({ 
  providers, 
  isLoading, 
  searchTerm, 
  onSearchChange, 
  onBookAppointment 
}: DoctorsTabProps) {
  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Doctors List */}
      {isLoading ? (
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
                      onClick={() => onBookAppointment(provider)}
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
  );
}
