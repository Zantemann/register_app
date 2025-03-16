import User from '@/models/userModel';
import dbConnect from '@/lib/dbCOnnect';
import { NextResponse, NextRequest } from 'next/server';

// Validate if phone number exists in the database
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId).populate('guests');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', err }, { status: 500 });
  }
}
