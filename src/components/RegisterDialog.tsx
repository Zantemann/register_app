'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useState } from 'react';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onRegister: (registrationData: RegistrationData) => void;
}

interface RegistrationData {
  fullName: string;
  company: string;
  jobTitle: string;
  phoneNumber: string;
}

export default function RegisterDialog({
  open,
  onClose,
  onRegister,
}: RegisterDialogProps): React.ReactElement {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    fullName: '',
    company: '',
    jobTitle: '',
    phoneNumber: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleRegistrationDataChange =
    (field: keyof RegistrationData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setRegistrationData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setError(null);
    };

  const handleSubmit = () => {
    try {
      onRegister(registrationData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const isSubmitDisabled = () => {
    return (
      !registrationData.fullName ||
      !registrationData.company ||
      !registrationData.jobTitle ||
      !registrationData.phoneNumber
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register for Tech Conference 2024</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography gutterBottom>
            Please provide your details to register for the Tech Conference
          </Typography>
          <TextField
            label="Full Name"
            value={registrationData.fullName}
            onChange={handleRegistrationDataChange('fullName')}
            fullWidth
            required
          />
          <TextField
            label="Company"
            value={registrationData.company}
            onChange={handleRegistrationDataChange('company')}
            fullWidth
            required
          />
          <TextField
            label="Job Title"
            value={registrationData.jobTitle}
            onChange={handleRegistrationDataChange('jobTitle')}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            value={registrationData.phoneNumber}
            onChange={handleRegistrationDataChange('phoneNumber')}
            fullWidth
            required
            placeholder="+358 XX XXX XXXX"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isSubmitDisabled()}>
            Register
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
