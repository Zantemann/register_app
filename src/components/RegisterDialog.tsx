'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
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
import { useRouter } from 'next/navigation';
import { RegisterStatus, IUser } from '@/types';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
}

const getStatusStyles = (status: string) => {
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
  user,
}: RegisterDialogProps): React.ReactElement {
  const [registerStatus, setRegisterStatus] = useState<RegisterStatus>(user.registerStatus);
  const [allergies, setAllergies] = useState(user.allergies || '');
  const [guests, setGuests] = useState(user.guests || []);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Reset form when dialog is closed
  const handleClose = (_: object, reason?: string) => {
    // Do not allow closing the dialog when clicking outside or pressing escape
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    setRegisterStatus(user.registerStatus);
    setAllergies(user.allergies || '');
    setGuests(user.guests || []);
    setError(null);
    onClose();
  };

  const handleStatusChange = (_: React.MouseEvent<HTMLElement>, value: RegisterStatus) => {
    if (value !== null) {
      setRegisterStatus(value);
      setError(null);
    }
  };

  const handleGuestStatusChange = (index: number, value: RegisterStatus) => {
    if (value !== null) {
      const updatedGuests = [...guests];
      updatedGuests[index] = { ...updatedGuests[index], registerStatus: value };
      setGuests(updatedGuests);
      setError(null);
    }
  };

  const handleGuestAllergiesChange = (index: number, value: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], allergies: value };
    setGuests(updatedGuests);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerStatus,
          allergies,
          guests: guests.map((guest) => ({
            _id: guest._id,
            registerStatus: guest.registerStatus,
            allergies: guest.allergies,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update registration');
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update registration');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            py: 4,
            px: 3,
            borderRadius: '2 2 0 0',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 40, color: 'common.white', mb: 2 }} />
            <DialogTitle
              variant="h5"
              sx={{
                color: 'common.white',
                mb: 1,
                p: 0,
                fontWeight: 500,
              }}
            >
              Event Registration
            </DialogTitle>
            <Typography
              variant="body1"
              sx={{
                color: 'common.white',
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

        <DialogContent sx={{ py: 4 }}>
          {error && (
            <Alert severity="error" sx={{ px: 3, mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}
            >
              <div>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                  {user.fullName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Please confirm your attendance
                </Typography>
              </div>
              <ToggleButtonGroup
                value={registerStatus}
                exclusive
                onChange={handleStatusChange}
                aria-label="attendance status"
                size="small"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  width: '100%',
                  '& .MuiToggleButton-root': {
                    borderRadius: '8px',
                    border: 'none',
                    '&[value="attending"]': getStatusStyles('attending'),
                    '&[value="not_attending"]': getStatusStyles('not_attending'),
                    '&[value="not_responded"]': getStatusStyles('not_responded'),
                  },
                }}
              >
                <ToggleButton value="attending" aria-label="attending" sx={{ px: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  Attending
                </ToggleButton>
                <ToggleButton value="not_attending" aria-label="not attending" sx={{ px: 2 }}>
                  <DoNotDisturbIcon sx={{ mr: 1 }} />
                  Not Attending
                </ToggleButton>
                <ToggleButton value="not_responded" aria-label="not responded" sx={{ px: 2 }}>
                  <HelpOutlineIcon sx={{ mr: 1 }} />
                  Not Responded
                </ToggleButton>
              </ToggleButtonGroup>
              <TextField
                label="Dietary Requirements or Preferences"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
            </Box>
          </Paper>

          {guests.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: 'primary.main',
                  mb: 4,
                  fontWeight: 'medium',
                }}
              >
                Additional Guests
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {guests.map((guest, index) => (
                  <Box key={index}>
                    {index > 0 && <Divider sx={{ my: 4 }} />}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                          {guest.fullName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          Please confirm their attendance
                        </Typography>
                      </div>
                      <ToggleButtonGroup
                        value={guest.registerStatus}
                        exclusive
                        onChange={(_, v) => handleGuestStatusChange(index, v)}
                        aria-label="guest attendance status"
                        size="small"
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 2,
                          '& .MuiToggleButton-root': {
                            borderRadius: 2,
                            border: 'none',
                            '&[value="attending"]': getStatusStyles('attending'),
                            '&[value="not_attending"]': getStatusStyles('not_attending'),
                            '&[value="not_responded"]': getStatusStyles('not_responded'),
                          },
                        }}
                      >
                        <ToggleButton value="attending" aria-label="attending" sx={{ px: 2 }}>
                          <CheckCircleIcon sx={{ mr: 1 }} />
                          Attending
                        </ToggleButton>
                        <ToggleButton
                          value="not_attending"
                          aria-label="not attending"
                          sx={{ px: 2 }}
                        >
                          <DoNotDisturbIcon sx={{ mr: 1 }} />
                          Not Attending
                        </ToggleButton>
                        <ToggleButton
                          value="not_responded"
                          aria-label="not responded"
                          sx={{ px: 2 }}
                        >
                          <HelpOutlineIcon sx={{ mr: 1 }} />
                          Not Responded
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <TextField
                        label="Dietary Requirements or Preferences"
                        value={guest.allergies || ''}
                        onChange={(e) => handleGuestAllergiesChange(index, e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{
                          mt: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                        slotProps={{ htmlInput: { maxLength: 500 } }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              onClick={() => handleClose({}, 'cancel')}
              variant="outlined"
              size="large"
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" size="large" sx={{ px: 3 }}>
              Update Status
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
