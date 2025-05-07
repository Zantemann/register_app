'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
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

  // Reset form values when closing via backdrop, escape key, or cancel button
  const handleClose = (_: object, reason?: string) => {
    // Do not allow closing the dialog when clicking outside or pressing escape
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth closeAfterTransition={false}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            py: 4,
            px: 3,
            borderRadius: '2 2 0 0',
          }}
        >
          <DialogTitle
            variant="h5"
            sx={{
              color: 'common.white',
              fontWeight: 500,
              p: 0,
              textAlign: 'center',
            }}
          >
            Login with Phone Number
          </DialogTitle>
        </Box>
        <DialogContent sx={{ py: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ px: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="body1" gutterBottom>
                  Enter your phone number to receive a login code
                </Typography>
                <MuiTelInput
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  fullWidth
                  defaultCountry="FI"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                {resendTimer > 0 && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    You can request a new code in {resendTimer} seconds
                  </Typography>
                )}
              </>
            )}

            {activeStep === 1 && (
              <>
                <Typography variant="body1" gutterBottom>
                  Enter the 6-digit login code sent to {phoneNumber}
                </Typography>
                <TextField
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  fullWidth
                  placeholder="000000"
                  slotProps={{ htmlInput: { maxLength: 6, pattern: '[0-9]*' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Box
                  sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Did not receive the code?
                  </Typography>
                  {resendTimer > 0 ? (
                    <Typography variant="body1" color="text.secondary">
                      You can request a new code in {resendTimer} seconds
                    </Typography>
                  ) : (
                    <Link component="button" variant="body1" onClick={handleResendCode}>
                      Send a new code
                    </Link>
                  )}
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
            <Button onClick={handleClose} variant="outlined" size="large" sx={{ px: 3 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isNextDisabled()}
              size="large"
              sx={{ px: 3 }}
            >
              {activeStep === STEPS.length - 1 ? 'Login' : 'Next'}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
