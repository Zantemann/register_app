import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/auth/session';
import { isValidAllergies, isValidRegisterStatus } from '@/lib/validate';
import { RegisterStatus } from '@/types/index';

interface UpdateUserBody {
  registerStatus: RegisterStatus;
  allergies?: string;
  guests?: Array<{
    _id: string;
    registerStatus: RegisterStatus;
    allergies?: string;
  }>;
}

// Update user registration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    let body: UpdateUserBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid request format',
        },
        { status: 400 },
      );
    }

    const { registerStatus, allergies, guests } = body;

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    // Validate register status
    if (!isValidRegisterStatus(registerStatus)) {
      return NextResponse.json(
        { error: 'Please select a valid registration status' },
        { status: 400 },
      );
    }

    // Validate allergies if provided
    if (allergies !== undefined && !isValidAllergies(allergies)) {
      return NextResponse.json({ error: 'Invalid allergies format' }, { status: 400 });
    }

    // Validate guests data if provided
    if (guests?.length) {
      for (const guest of guests) {
        if (!guest._id) {
          return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
        }
        if (!isValidRegisterStatus(guest.registerStatus)) {
          return NextResponse.json(
            { error: `Please select a valid registration status for guest` },
            { status: 400 },
          );
        }
        if (guest.allergies !== undefined && !isValidAllergies(guest.allergies)) {
          return NextResponse.json(
            { error: `Invalid allergies format for guest` },
            { status: 400 },
          );
        }
      }
    }

    // Get session to check if the user is authorized to update their own information
    const currentSession = await getSession();
    if (currentSession?.userId._id !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to update this information' },
        { status: 401 },
      );
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
      // Update main user's information
      user.registerStatus = registerStatus;
      user.allergies = allergies;

      // Update guests
      if (guests && Array.isArray(guests)) {
        for (const guest of guests) {
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

      await user.save();
      const updatedUser = await User.findById(userId).populate('guests');

      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: 'Failed to update registration. Please try again.' },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Unable to process your request. Please try again later.' },
      { status: 500 },
    );
  }
}
