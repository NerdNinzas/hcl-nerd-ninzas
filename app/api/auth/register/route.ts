import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, role = 'patient', ...additionalData } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate role
    const validRoles = ['patient', 'provider', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Validate provider-specific fields
    if (role === 'provider') {
      if (!additionalData.specialty || !additionalData.licenseNumber) {
        return NextResponse.json(
          { error: 'Specialty and license number are required for providers' },
          { status: 400 }
        );
      }
    }

    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      ...additionalData,
      // Set default health goals for patients
      ...(role === 'patient' && {
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
      })
    };

    const user = await User.create(userData);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}