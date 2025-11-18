export interface Provider {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  clinic?: string;
  bio?: string;
  availableHours?: { day: string; startTime: string; endTime: string }[];
  maxPatients: number;
  currentPatients: number;
  image?: string;
}

export interface Appointment {
  _id: string;
  provider: {
    _id: string;
    name: string;
    email: string;
    specialty: string;
    clinic?: string;
  };
  appointmentDate?: string;
  appointmentTime?: string;
  status: string;
  type?: string;
  patientNotes?: string;
  providerNotes?: string;
  createdAt: string;
}

export interface Goal {
  _id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  frequency: string;
  status: string;
  endDate?: string;
  provider?: {
    name: string;
  };
  progress?: {
    value: number;
    note?: string;
    date: string;
  }[];
}

export interface UserData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
}
