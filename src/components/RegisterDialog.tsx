'use client';

import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onRegister: (registrationData: RegistrationData) => void;
}

type AttendanceStatus = 'attending' | 'not_attending' | 'not_responded';

interface RegistrationData {
  fullName: string;
  registerStatus: AttendanceStatus;
  allergies?: string;
  guests: Array<{
    fullName: string;
    registerStatus: AttendanceStatus;
    allergies?: string;
  }>;
}

// Placeholder data
const PLACEHOLDER_DATA: RegistrationData = {
  fullName: 'John Smith',
  registerStatus: 'not_responded',
  allergies: '',
  guests: [
    {
      fullName: 'Jane Smith',
      registerStatus: 'not_responded',
      allergies: '',
    },
    {
      fullName: 'Mike Johnson',
      registerStatus: 'not_responded',
      allergies: '',
    },
  ],
};

const getStatusStyles = (status: AttendanceStatus) => {
  switch (status) {
    case 'attending':
      return {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        '&.Mui-selected': {
          backgroundColor: '#2e7d32',
          color: 'white',
          '&:hover': {
            backgroundColor: '#1b5e20',
          },
        },
      };
    case 'not_attending':
      return {
        backgroundColor: '#ffebee',
        color: '#c62828',
        '&.Mui-selected': {
          backgroundColor: '#c62828',
          color: 'white',
          '&:hover': {
            backgroundColor: '#b71c1c',
          },
        },
      };
    default:
      return {
        backgroundColor: '#f5f5f5',
        color: '#757575',
        '&.Mui-selected': {
          backgroundColor: '#757575',
          color: 'white',
          '&:hover': {
            backgroundColor: '#616161',
          },
        },
      };
  }
};

export default function RegisterDialog({
  open,
  onClose,
  onRegister,
}: RegisterDialogProps): React.ReactElement {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(PLACEHOLDER_DATA);
  const [error, setError] = useState<string | null>(null);

  const handleRegistrationDataChange =
    (field: keyof Omit<RegistrationData, 'guests'>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRegistrationData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setError(null);
    };

  const handleStatusChange = (_: React.MouseEvent<HTMLElement>, value: AttendanceStatus) => {
    if (value !== null) {
      setRegistrationData((prev) => ({
        ...prev,
        registerStatus: value,
      }));
      setError(null);
    }
  };

  const handleGuestStatusChange = (
    index: number,
    _: React.MouseEvent<HTMLElement>,
    value: AttendanceStatus,
  ) => {
    if (value !== null) {
      setRegistrationData((prev) => ({
        ...prev,
        guests: prev.guests.map((guest, i) =>
          i === index ? { ...guest, registerStatus: value } : guest,
        ),
      }));
      setError(null);
    }
  };

  const handleGuestChange = (index: number, field: string, value: string) => {
    setRegistrationData((prev) => ({
      ...prev,
      guests: prev.guests.map((guest, i) => (i === index ? { ...guest, [field]: value } : guest)),
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ position: 'relative', bgcolor: 'background.paper' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            pt: 6,
            pb: 6,
            px: 3,
            borderRadius: '4px 4px 0 0',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 40, color: 'common.white', mb: 2 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: 'common.white',
                mb: 1,
                fontWeight: 500,
              }}
            >
              Event Registration
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'common.white',
                opacity: 0.9,
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.5,
              }}
            >
              Please confirm attendance for yourself and your guests. You can update your response
              and dietary requirements at any time.
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ pt: 4, pb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={2}
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 'medium', letterSpacing: 0.5 }}
              >
                {registrationData.fullName}
              </Typography>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}
              >
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Please confirm your attendance
                </Typography>
                <ToggleButtonGroup
                  value={registrationData.registerStatus}
                  exclusive
                  onChange={handleStatusChange}
                  aria-label="attendance status"
                  size="large"
                  sx={{
                    '& .MuiToggleButton-root': {
                      borderRadius: '8px !important',
                      mx: 0.5,
                      border: 'none',
                      '&[value="attending"]': getStatusStyles('attending'),
                      '&[value="not_attending"]': getStatusStyles('not_attending'),
                      '&[value="not_responded"]': getStatusStyles('not_responded'),
                    },
                  }}
                >
                  <ToggleButton value="attending" aria-label="attending" sx={{ px: 3 }}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Attending
                  </ToggleButton>
                  <ToggleButton value="not_attending" aria-label="not attending" sx={{ px: 3 }}>
                    <DoNotDisturbIcon sx={{ mr: 1 }} />
                    Not Attending
                  </ToggleButton>
                  <ToggleButton value="not_responded" aria-label="not responded" sx={{ px: 3 }}>
                    <HelpOutlineIcon sx={{ mr: 1 }} />
                    Not Responded
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <TextField
              label="Dietary Requirements or Preferences"
              value={registrationData.allergies}
              onChange={handleRegistrationDataChange('allergies')}
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 3 }}
            />
          </Paper>

          {registrationData.guests.length > 0 && (
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: 'primary.main',
                  mb: 3,
                  fontWeight: 'medium',
                  letterSpacing: 0.5,
                }}
              >
                Additional Guests
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {registrationData.guests.map((guest, index) => (
                  <Box key={index}>
                    {index > 0 && <Divider sx={{ my: 4 }} />}
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {guest.fullName}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Please confirm their attendance
                        </Typography>
                        <ToggleButtonGroup
                          value={guest.registerStatus}
                          exclusive
                          onChange={(e, v) => handleGuestStatusChange(index, e, v)}
                          aria-label="guest attendance status"
                          size="large"
                          sx={{
                            '& .MuiToggleButton-root': {
                              borderRadius: '8px !important',
                              mx: 0.5,
                              border: 'none',
                              '&[value="attending"]': getStatusStyles('attending'),
                              '&[value="not_attending"]': getStatusStyles('not_attending'),
                              '&[value="not_responded"]': getStatusStyles('not_responded'),
                            },
                          }}
                        >
                          <ToggleButton value="attending" aria-label="attending" sx={{ px: 3 }}>
                            <CheckCircleIcon sx={{ mr: 1 }} />
                            Attending
                          </ToggleButton>
                          <ToggleButton
                            value="not_attending"
                            aria-label="not attending"
                            sx={{ px: 3 }}
                          >
                            <DoNotDisturbIcon sx={{ mr: 1 }} />
                            Not Attending
                          </ToggleButton>
                          <ToggleButton
                            value="not_responded"
                            aria-label="not responded"
                            sx={{ px: 3 }}
                          >
                            <HelpOutlineIcon sx={{ mr: 1 }} />
                            Not Responded
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                      <TextField
                        label="Dietary Requirements or Preferences"
                        value={guest.allergies}
                        onChange={(e) => handleGuestChange(index, 'allergies', e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mt: 3 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                textTransform: 'none',
                fontSize: '1rem',
                bgcolor: 'primary.main',
              }}
            >
              Update Status
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
