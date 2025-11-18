import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'provider') {
      return NextResponse.json(
        { error: 'Unauthorized. Only providers can access patient list.' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Get all unique patients who have confirmed appointments with this provider
    const appointments = await Appointment.find({
      provider: session.user.id,
      status: 'confirmed'
    })
      .populate('patient', 'name email phoneNumber dateOfBirth medicalInfo')
      .sort({ createdAt: -1 });
    
    // Extract unique patients
    const patientMap = new Map();
    appointments.forEach(appointment => {
      const patient = appointment.patient as any;
      if (patient && !patientMap.has(patient._id.toString())) {
        patientMap.set(patient._id.toString(), patient);
      }
    });
    
    const patients = Array.from(patientMap.values());
    
    return NextResponse.json({ patients });
    
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

