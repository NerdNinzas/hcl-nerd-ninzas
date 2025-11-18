import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
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
    
    // Get all providers who have completed their profile and are accepting patients
    const providers = await User.find({
      role: 'provider',
      profileCompleted: true,
      $expr: { $lt: ['$currentPatients', '$maxPatients'] }
    }).select('name email specialty clinic bio availableHours maxPatients currentPatients image');
    
    return NextResponse.json({ providers });
    
  } catch (error) {
    console.error('Get providers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

