'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { MuiTelInput } from 'mui-tel-input';
import { useRouter } from 'next/navigation';
import { isValidNumber } from '@/lib/validate';

const STEPS = ['Phone Number', 'Login Code'];
const RESEND_TIMEOUT = 30; // seconds

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthDialog({ open, onClose }: AuthDialogProps): React.ReactElement {
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setError(null);
  };

  const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
    setError(null);
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(`/api/otp/send/${phoneNumber}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resend OTP');
      }

      setResendTimer(RESEND_TIMEOUT);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    }
  };

  const handleNext = async () => {
    try {
      if (activeStep === 0) {
        const response = await fetch(`/api/otp/send/${phoneNumber}`, {
          method: 'POST',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to send OTP');
        }

        setActiveStep(1);
        setResendTimer(RESEND_TIMEOUT);
      } else if (activeStep === 1) {
        const response = await fetch(`/api/otp/verify/${phoneNumber}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp: verificationCode }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to verify OTP');
        }

        router.refresh();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
    setVerificationCode('');
  };

  // Reset form values when closing via backdrop, escape key, or cancel button
  const handleClose = (_: object, _reason?: string) => {
    setPhoneNumber('');
    setVerificationCode('');
    setActiveStep(0);
    setError(null);
    onClose();
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !isValidNumber(phoneNumber) || resendTimer > 0;
    }
    if (activeStep === 1) {
      return !verificationCode || verificationCode.length !== 6;
    }
    return false;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Login with Phone Number</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ py: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {activeStep === 0 && (
            <>
              <Typography gutterBottom>Enter your phone number to receive a login code</Typography>
              <MuiTelInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                fullWidth
                defaultCountry="FI"
              />
              {resendTimer > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  You can request a new code in {resendTimer} seconds
                </Typography>
              )}
            </>
          )}

          {activeStep === 1 && (
            <>
              <Typography gutterBottom>
                Enter the 6-digit login code sent to {phoneNumber}
              </Typography>
              <TextField
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                fullWidth
                placeholder="000000"
                inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              />
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Did not receive the code?
                </Typography>
                {resendTimer > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    You can request a new code in {resendTimer} seconds
                  </Typography>
                ) : (
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleResendCode}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Send a new code
                  </Link>
                )}
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Box>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button variant="contained" onClick={handleNext} disabled={isNextDisabled()}>
              {activeStep === STEPS.length - 1 ? 'Login' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
