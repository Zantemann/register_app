import {
  parsePhoneNumberFromString as parsePhoneNumber,
  isValidPhoneNumber,
} from 'libphonenumber-js';
import { RegisterStatus } from '@/types/index';

export const isValidNumber = (phoneNumber: string): boolean => {
  // Validate the phone number (defaults to any region)
  return isValidPhoneNumber(phoneNumber);
};

// Parsing phone number to correct format
export const parseNumber = (phoneNumber: string): string => {
  try {
    // Parse and format to E.164 format
    const parsedNumber = parsePhoneNumber(phoneNumber);
    if (parsedNumber) {
      return parsedNumber.format('E.164');
    }
    return '';
  } catch (error) {
    console.error('Error validating phone number:', error);
    return '';
  }
};

// Validate OTP
export const isValidOTP = (otp: string): boolean => {
  // Must be exactly 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// Validate user preferences input
export const isValidAllergies = (preferences: string): boolean => {
  // Allow empty string and validate length
  return !preferences || (typeof preferences === 'string' && preferences.trim().length < 500);
};

export const isValidRegisterStatus = (status: string): status is RegisterStatus => {
  return ['attending', 'not_attending', 'not_responded'].includes(status);
};
