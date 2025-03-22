'use client';

import { Button } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from 'react';
import RegisterDialog from './RegisterDialog';

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

interface RegisterButtonProps {
  currentStatus?: AttendanceStatus;
}

export default function RegisterButton({
  currentStatus = 'not_responded',
}: RegisterButtonProps): React.ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleRegister = (registrationData: RegistrationData) => {
    // For demonstration, just log the data
    console.log('Registration data:', registrationData);
    handleClose();
  };

  const isFirstTime = currentStatus === 'not_responded';

  return (
    <>
      <Button
        variant={isFirstTime ? 'contained' : 'outlined'}
        startIcon={isFirstTime ? <CalendarTodayIcon /> : <HowToRegIcon />}
        onClick={handleOpen}
        size="large"
        sx={{
          px: [3, 4, 6],
          py: [1, 1.5],
          minWidth: 200,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          ...(isFirstTime && {
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }),
        }}
      >
        {isFirstTime ? 'Register Now' : 'Update Attendance'}
      </Button>
      <RegisterDialog open={isDialogOpen} onClose={handleClose} onRegister={handleRegister} />
    </>
  );
}

