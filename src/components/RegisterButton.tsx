'use client';

import { Button } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useState } from 'react';
import RegisterDialog from './RegisterDialog';

interface RegistrationData {
  fullName: string;
  company: string;
  jobTitle: string;
  phoneNumber: string;
}

export default function RegisterButton(): React.ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleRegister = (registrationData: RegistrationData) => {
    // TODO: Implement registration logic
    console.log('Registration data:', registrationData);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<HowToRegIcon />}
        onClick={handleOpen}
        size="large"
        sx={{
          px: [3, 4, 6],
          py: [1, 1.5],
          minWidth: 200,
        }}
      >
        Register Now
      </Button>
      <RegisterDialog open={isDialogOpen} onClose={handleClose} onRegister={handleRegister} />
    </>
  );
}
