import User from '@/models/userModel';
import dbConnect from '@/lib/dbCOnnect';
import { NextResponse, NextRequest } from 'next/server';

// Validate if phone number exists in the database

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phoneNumber');

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', err }, { status: 500 });
  }
}
