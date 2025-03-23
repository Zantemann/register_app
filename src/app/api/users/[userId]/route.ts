import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/auth/session';

// Update user registration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const { registerStatus, allergies, guests } = body;

    if (!registerStatus) {
      return NextResponse.json({ error: 'Registration status is required' }, { status: 400 });
    }

    const currentSession = await getSession();
    if (currentSession?.userId._id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update main user's information
    user.registerStatus = registerStatus;
    if (allergies !== undefined) {
      user.allergies = allergies;
    }

    // Update guests
    if (guests && Array.isArray(guests)) {
      for (const guest of guests) {
        if (guest._id) {
          // Check if the guest is in the current user's guests
          if (currentSession?.userId.guests.some((g) => g._id === guest._id)) {
            const existingGuest = await User.findById(guest._id);
            if (existingGuest) {
              existingGuest.registerStatus = guest.registerStatus;
              if (guest.allergies !== undefined) {
                existingGuest.allergies = guest.allergies;
              }
              await existingGuest.save();
            }
          }
        }
      }
    }

    await user.save();
    const updatedUser = await User.findById(userId).populate('guests');

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', err }, { status: 500 });
  }
}
