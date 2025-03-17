import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const serviceId = process.env.TWILIO_SERVICE_ID as string;
const client = twilio(accountSid, authToken);

// Validate if phone number exists in the database
// Verify OTP
// Return user access
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ phoneNumber: string }> },
) {
  try {
    const { phoneNumber } = await params;
    const body = await request.json();
    const { otp } = body;

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP code are required' },
        { status: 400 },
      );
    }

    await dbConnect();
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json(
        { error: 'Phone number not found from invitation list' },
        { status: 404 },
      );
    }

    const twilioResponse = await client.verify.v2.services(serviceId).verificationChecks.create({
      to: phoneNumber,
      code: otp,
    });

    if (twilioResponse.status === 'approved') {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', err }, { status: 500 });
  }
}
