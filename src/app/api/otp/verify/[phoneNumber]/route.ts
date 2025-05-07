import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';
import { createSession } from '@/auth/session';
import { isValidNumber, isValidOTP, parseNumber } from '@/lib/validate';

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

    // Validate phone number and OTP
    if (!isValidNumber(phoneNumber) || !isValidOTP(otp)) {
      return NextResponse.json({ error: 'Invalid phone number or OTP' }, { status: 400 });
    }

    // Parse the phone number to E.164 format
    const cleanPhoneNumber = parseNumber(phoneNumber);

    await dbConnect();
    const user = await User.findOne({ phoneNumber: cleanPhoneNumber });
    if (!user) {
      return NextResponse.json(
        { error: 'Phone number not found from invitation list' },
        { status: 404 },
      );
    }

    // for testing purposes
    //await createSession(user);
    //return NextResponse.json({ user }, { status: 200 });

    const twilioResponse = await client.verify.v2.services(serviceId).verificationChecks.create({
      to: cleanPhoneNumber,
      code: otp,
    });

    if (twilioResponse.status === 'approved') {
      await createSession(user);
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', err }, { status: 500 });
  }
}
