'use server';

import crypto from 'crypto';
import { ISession, IUser } from '@/types';
import { cookies } from 'next/headers';
import Session from '@/models/sessionModel';
import dbConnect from '@/lib/dbConnect';
import { cache } from 'react';
const SESSION_EXPIRATION_TIME = 60 * 60 * 24; // 1 day in seconds
const COOKIE_SESSION_KEY = 'sessionId';

// Create a new session
export const createSession = async (user: IUser) => {
  const sessionId = crypto.randomBytes(50).toString('hex').normalize();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME * 1000);

  await dbConnect();

  // Optional for safety
  // Delete any existing sessions for this user
  await Session.deleteMany({ userId: user._id });

  // Create new session
  await Session.insertOne({
    sessionId,
    userId: user._id,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict', // possible: lax
    expires: expiresAt,
  });
};

// Get the current user from the session
export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) {
    return;
  }

  await dbConnect();
  const session = await Session.findOne({ sessionId }).populate('userId');
  if (!session) {
    return;
  }

  // Convert MongoDB ObjectId to string
  return session as ISession;
});

// Delete the current session
export const deleteSession = async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) {
    return;
  }

  await dbConnect();
  await Session.deleteOne({ sessionId });

  cookieStore.delete(COOKIE_SESSION_KEY);
};
