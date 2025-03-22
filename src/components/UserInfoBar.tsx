import { Typography, Button, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { deleteSession } from '@/auth/session';
import { IUser } from '@/types';

export default function UserInfoBar({ user }: { user: IUser }): React.ReactElement {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        zIndex: 1000,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {user.fullName}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<LogoutIcon />}
        onClick={deleteSession}
        sx={{ textTransform: 'none' }}
      >
        Logout
      </Button>
    </Paper>
  );
}
