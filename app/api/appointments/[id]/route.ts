import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { status, providerNotes } = body;
    
    if (!status || !['confirmed', 'rejected', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Check authorization
    const isProvider = session.user.role === 'provider';
    const isOwner = appointment.patient.toString() === session.user.id;
    const isAppointmentProvider = appointment.provider.toString() === session.user.id;
    
    if (!isOwner && !isAppointmentProvider) {
      return NextResponse.json(
        { error: 'Unauthorized to update this appointment' },
        { status: 403 }
      );
    }
    
    // Only provider can confirm/reject
    if ((status === 'confirmed' || status === 'rejected') && !isAppointmentProvider) {
      return NextResponse.json(
        { error: 'Only the provider can confirm or reject appointments' },
        { status: 403 }
      );
    }
    
    // Update appointment
    appointment.status = status;
    if (providerNotes) {
      appointment.providerNotes = providerNotes;
    }
    await appointment.save();
    
    // Update provider's current patient count
    if (status === 'confirmed' && appointment.status !== 'confirmed') {
      await User.findByIdAndUpdate(
        appointment.provider,
        { $inc: { currentPatients: 1 } }
      );
    } else if ((status === 'rejected' || status === 'cancelled') && appointment.status === 'confirmed') {
      await User.findByIdAndUpdate(
        appointment.provider,
        { $inc: { currentPatients: -1 } }
      );
    }
    
    return NextResponse.json({ appointment });
    
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Only patient or provider can delete
    const isOwner = appointment.patient.toString() === session.user.id;
    const isProvider = appointment.provider.toString() === session.user.id;
    
    if (!isOwner && !isProvider) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this appointment' },
        { status: 403 }
      );
    }
    
    // Decrease provider's patient count if appointment was confirmed
    if (appointment.status === 'confirmed') {
      await User.findByIdAndUpdate(
        appointment.provider,
        { $inc: { currentPatients: -1 } }
      );
    }
    
    await appointment.deleteOne();
    
    return NextResponse.json({ message: 'Appointment deleted successfully' });
    
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

