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

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Please provide a verification code',
        },
        { status: 400 },
      );
    }

    const { otp } = body;

    if (!isValidNumber(phoneNumber)) {
      return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 });
    }

    if (!isValidOTP(otp)) {
      return NextResponse.json(
        { error: 'Please enter a valid verification code' },
        { status: 400 },
      );
    }

    // Parse the phone number to E.164 format
    const cleanPhoneNumber = parseNumber(phoneNumber);

    await dbConnect();
    const user = await User.findOne({ phoneNumber: cleanPhoneNumber });
    if (!user) {
      return NextResponse.json(
        { error: 'This phone number is not in the invitation list' },
        { status: 404 },
      );
    }

    // for testing purposes
    //await createSession(user);
    //return NextResponse.json({ user }, { status: 200 });

    try {
      const twilioResponse = await client.verify.v2.services(serviceId).verificationChecks.create({
        to: cleanPhoneNumber,
        code: otp,
      });

      if (twilioResponse.status === 'approved') {
        await createSession(user);
        return NextResponse.json({ user }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: 'Invalid verification code. Please try again.' },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Unable to verify code. Please try again.' },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Verification service unavailable. Please try again later.' },
      { status: 500 },
    );
  }
}
