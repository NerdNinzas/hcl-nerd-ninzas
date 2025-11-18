import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Check if demo users already exist
    const existingPatient = await User.findOne({ email: 'patient@demo.com' });
    const existingProvider = await User.findOne({ email: 'provider@demo.com' });

    if (existingPatient && existingProvider) {
      return NextResponse.json({
        message: 'Demo users already exist',
        users: [
          { email: 'patient@demo.com', role: 'patient', password: 'password123' },
          { email: 'provider@demo.com', role: 'provider', password: 'password123' }
        ]
      });
    }

    const demoUsers = [];

    // Create demo patient if doesn't exist
    if (!existingPatient) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const demoPatient = await User.create({
        name: 'Demo Patient',
        email: 'patient@demo.com',
        password: hashedPassword,
        role: 'patient',
        dateOfBirth: new Date('1990-01-15'),
        phoneNumber: '(555) 123-4567',
        address: {
          street: '123 Health St',
          city: 'Wellness City',
          state: 'CA',
          zipCode: '90210'
        },
        medicalInfo: {
          allergies: ['Penicillin'],
          medications: ['Multivitamin'],
          conditions: [],
          bloodType: 'O+',
          height: 170,
          weight: 70
        },
        healthGoals: {
          dailySteps: 10000,
          waterIntake: 8,
          sleepHours: 8,
          exerciseMinutes: 30
        },
        privacySettings: {
          shareDataWithProviders: true,
          allowResearchParticipation: false,
          receiveHealthTips: true,
          receiveReminders: true
        }
      });
      demoUsers.push({ email: 'patient@demo.com', role: 'patient' });
    }

    // Create demo provider if doesn't exist
    if (!existingProvider) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const demoProvider = await User.create({
        name: 'Dr. Demo Provider',
        email: 'provider@demo.com',
        password: hashedPassword,
        role: 'provider',
        specialty: 'Internal Medicine',
        licenseNumber: 'MD123456789',
        clinic: 'Demo Health Clinic',
        phoneNumber: '(555) 987-6543'
      });
      demoUsers.push({ email: 'provider@demo.com', role: 'provider' });
    }

    return NextResponse.json({
      message: 'Demo users created successfully',
      users: [
        { email: 'patient@demo.com', role: 'patient', password: 'password123' },
        { email: 'provider@demo.com', role: 'provider', password: 'password123' }
      ],
      created: demoUsers
    });

  } catch (error: any) {
    console.error('Demo setup error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo users', details: error.message },
      { status: 500 }
    );
  }
}