import mongoose from 'mongoose';

export interface IAppointment {
  _id?: string;
  patient: mongoose.Types.ObjectId | string;
  provider: mongoose.Types.ObjectId | string;
  appointmentDate?: Date;
  appointmentTime?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  type?: string;
  notes?: string;
  patientNotes?: string;
  providerNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AppointmentSchema = new mongoose.Schema<IAppointment>({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required']
  },
  appointmentDate: {
    type: Date
  },
  appointmentTime: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  type: {
    type: String,
    default: 'General Consultation'
  },
  notes: {
    type: String
  },
  patientNotes: {
    type: String
  },
  providerNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
AppointmentSchema.index({ patient: 1, status: 1 });
AppointmentSchema.index({ provider: 1, status: 1 });
AppointmentSchema.index({ appointmentDate: 1 });

const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;

