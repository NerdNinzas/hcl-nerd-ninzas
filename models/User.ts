import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'patient' | 'provider' | 'admin';
  image?: string;
  emailVerified?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Patient-specific fields
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    bloodType?: string;
    height?: number;
    weight?: number;
  };
  
  // Provider-specific fields
  specialty?: string;
  licenseNumber?: string;
  clinic?: string;
  
  // Health goals and tracking
  healthGoals?: {
    dailySteps?: number;
    waterIntake?: number;
    sleepHours?: number;
    exerciseMinutes?: number;
  };
  
  // Privacy and consent
  privacySettings?: {
    shareDataWithProviders?: boolean;
    allowResearchParticipation?: boolean;
    receiveHealthTips?: boolean;
    receiveReminders?: boolean;
  };
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    select: false, // Don't include password in queries by default
    minLength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['patient', 'provider', 'admin'],
    default: 'patient',
    required: true
  },
  image: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Date,
    default: null
  },
  
  // Patient-specific fields
  dateOfBirth: {
    type: Date
  },
  phoneNumber: {
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  medicalInfo: {
    allergies: [String],
    medications: [String],
    conditions: [String],
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    height: Number, // in cm
    weight: Number  // in kg
  },
  
  // Provider-specific fields
  specialty: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'provider';
    }
  },
  licenseNumber: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'provider';
    }
  },
  clinic: String,
  
  // Health goals
  healthGoals: {
    dailySteps: { type: Number, default: 10000 },
    waterIntake: { type: Number, default: 8 }, // glasses
    sleepHours: { type: Number, default: 8 },
    exerciseMinutes: { type: Number, default: 30 }
  },
  
  // Privacy settings
  privacySettings: {
    shareDataWithProviders: { type: Boolean, default: true },
    allowResearchParticipation: { type: Boolean, default: false },
    receiveHealthTips: { type: Boolean, default: true },
    receiveReminders: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Virtual for age calculation
UserSchema.virtual('age').get(function(this: IUser) {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;