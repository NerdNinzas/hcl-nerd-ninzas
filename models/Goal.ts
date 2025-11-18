import mongoose from 'mongoose';

export interface IGoal {
  _id?: string;
  patient: mongoose.Types.ObjectId | string;
  provider: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  progress: {
    date: Date;
    value: number;
    note?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const GoalSchema = new mongoose.Schema<IGoal>({
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
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetValue: {
    type: Number,
    required: [true, 'Target value is required']
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  progress: [{
    date: {
      type: Date,
      default: Date.now
    },
    value: Number,
    note: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
GoalSchema.index({ patient: 1, status: 1 });
GoalSchema.index({ provider: 1 });
GoalSchema.index({ startDate: 1 });

// Virtual for completion percentage
GoalSchema.virtual('completionPercentage').get(function() {
  if (this.targetValue === 0) return 0;
  return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
});

const Goal = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;

