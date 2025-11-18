import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const userId = session.user.id;
    const userRole = session.user.role;
    
    let appointments;
    
    if (userRole === 'provider') {
      // Get appointments for this provider
      appointments = await Appointment.find({ provider: userId })
        .populate('patient', 'name email phoneNumber dateOfBirth')
        .sort({ createdAt: -1 });
    } else {
      // Get appointments for this patient
      appointments = await Appointment.find({ patient: userId })
        .populate('provider', 'name email specialty clinic')
        .sort({ createdAt: -1 });
    }
    
    return NextResponse.json({ appointments });
    
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { providerId, appointmentDate, appointmentTime, type, patientNotes } = body;
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    // Check if provider exists and has space for patients
    const provider = await User.findById(providerId);
    
    if (!provider || provider.role !== 'provider') {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    if (provider.currentPatients >= provider.maxPatients) {
      return NextResponse.json(
        { error: 'Provider is not accepting new patients' },
        { status: 400 }
      );
    }
    
    // Check if patient already has a pending or confirmed appointment with this provider
    const existingAppointment = await Appointment.findOne({
      patient: session.user.id,
      provider: providerId,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return NextResponse.json(
        { error: 'You already have a pending or confirmed appointment with this provider' },
        { status: 400 }
      );
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patient: session.user.id,
      provider: providerId,
      appointmentDate,
      appointmentTime,
      type,
      patientNotes,
      status: 'pending'
    });
    
    return NextResponse.json({ appointment }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create appointment error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

