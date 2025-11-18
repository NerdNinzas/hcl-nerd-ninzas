import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

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
    const { progressValue, progressNote, status } = body;
    
    const goal = await Goal.findById(id);
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    // Check authorization
    const isPatient = goal.patient.toString() === session.user.id;
    const isProvider = goal.provider.toString() === session.user.id;
    
    if (!isPatient && !isProvider) {
      return NextResponse.json(
        { error: 'Unauthorized to update this goal' },
        { status: 403 }
      );
    }
    
    // Patient can add progress
    if (progressValue !== undefined && isPatient) {
      goal.progress.push({
        date: new Date(),
        value: progressValue,
        note: progressNote
      });
      goal.currentValue += progressValue;
      
      // Auto-complete if target reached
      if (goal.currentValue >= goal.targetValue && goal.status === 'active') {
        goal.status = 'completed';
      }
    }
    
    // Provider or patient can update status
    if (status && ['active', 'completed', 'cancelled'].includes(status)) {
      goal.status = status;
    }
    
    await goal.save();
    
    return NextResponse.json({ goal });
    
  } catch (error) {
    console.error('Update goal error:', error);
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
    
    if (!session || !session.user || session.user.role !== 'provider') {
      return NextResponse.json(
        { error: 'Unauthorized. Only providers can delete goals.' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const goal = await Goal.findById(id);
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    // Only provider who created the goal can delete
    if (goal.provider.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this goal' },
        { status: 403 }
      );
    }
    
    await goal.deleteOne();
    
    return NextResponse.json({ message: 'Goal deleted successfully' });
    
  } catch (error) {
    console.error('Delete goal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

