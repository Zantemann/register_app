'use client';

import { Button } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from 'react';
import RegisterDialog from './RegisterDialog';
import { IUser } from '@/types';

export default function RegisterButton({ user }: { user: IUser }): React.ReactElement {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFirstTime = user.registerStatus === 'not_responded';

  return (
    <>
      <Button
        variant={isFirstTime ? 'contained' : 'outlined'}
        startIcon={isFirstTime ? <CalendarTodayIcon /> : <HowToRegIcon />}
        onClick={handleOpen}
        size="large"
        sx={{
          px: 3,
        }}
      >
        {isFirstTime ? 'Register Now' : 'Update Attendance'}
      </Button>
      <RegisterDialog open={open} onClose={handleClose} user={user} />
    </>
  );
}
