import { Box, Container, Typography, Paper } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AuthButton from '@/components/AuthButton';
import RegisterButton from '@/components/RegisterButton';
import UserInfoBar from '@/components/UserInfoBar';
import { getSession } from '@/auth/session';

export default async function Home(): Promise<React.ReactElement> {
  const session = await getSession();

  return (
    <Container maxWidth="md">
      <Box sx={{ pt: 2 }}>{session && <UserInfoBar user={session.userId} />}</Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: [3, 6, 8],
          textAlign: 'center',
          width: '100%',
        }}
      >
        <EventIcon sx={{ fontSize: [40, 48, 60], color: 'primary.main', mb: 4 }} />

        <Typography variant="h1" component="h1" gutterBottom>
          Tech Conference 2024
        </Typography>

        <Typography variant="h2" component="h2" color="text.secondary" gutterBottom>
          An exclusive tech leadership event
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: [2, 3, 4],
            mt: [3, 4],
            mb: [4, 6],
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" sx={{ mb: 4 }}>
            Join an exclusive gathering of industry leaders and innovators for a private tech
            conference. This invite-only event brings together selected tech leaders for high-level
            discussions, strategic workshops, and exclusive networking opportunities.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: ['column', 'row'],
              gap: [2, 3],
              justifyContent: 'center',
              alignItems: 'center',
              mt: [3, 4],
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon color="primary" />
              <Typography variant="h6" component="div">
                June 15-16, 2024
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="primary" />
              <Typography variant="h6" component="div">
                Tech Center
              </Typography>
            </Box>
          </Box>
        </Paper>

        {!session && <AuthButton />}
        {session && <RegisterButton user={session?.userId} />}
      </Box>
    </Container>
  );
}
