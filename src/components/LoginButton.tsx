'use client';

import { Button, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { useState } from 'react';
import AuthDialog from './AuthDialog';

export default function LoginButton(): React.ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        startIcon={<PhoneIcon />}
        sx={{
          px: [3, 4, 6],
          py: [1, 1.5],
          minWidth: 200,
        }}
        onClick={handleOpenDialog}
      >
        Login with Phone
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: [3, 4] }}>
        Login is restricted to invited phone numbers
      </Typography>

      <AuthDialog open={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
}
