import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

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
    
    let goals;
    
    if (userRole === 'provider') {
      // Get goals created by this provider
      goals = await Goal.find({ provider: userId })
        .populate('patient', 'name email phoneNumber')
        .sort({ createdAt: -1 });
    } else {
      // Get goals for this patient
      goals = await Goal.find({ patient: userId })
        .populate('provider', 'name email specialty')
        .sort({ createdAt: -1 });
    }
    
    return NextResponse.json({ goals });
    
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'provider') {
      return NextResponse.json(
        { error: 'Unauthorized. Only providers can create goals.' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { patientId, title, description, targetValue, unit, frequency, endDate } = body;
    
    if (!patientId || !title || !targetValue || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create goal
    const goal = await Goal.create({
      patient: patientId,
      provider: session.user.id,
      title,
      description,
      targetValue,
      unit,
      frequency: frequency || 'daily',
      endDate: endDate ? new Date(endDate) : undefined,
      currentValue: 0,
      status: 'active'
    });
    
    return NextResponse.json({ goal }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create goal error:', error);
    
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

