import { Typography, Button, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { deleteSession } from '@/auth/session';
import { IUser } from '@/types';

export default function UserInfoBar({ user }: { user: IUser }): React.ReactElement {
  return (
    <Paper
      elevation={0}
      sx={{
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {user.fullName}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<LogoutIcon />}
        onClick={deleteSession}
        sx={{ px: 3 }}
      >
        Logout
      </Button>
    </Paper>
  );
}
