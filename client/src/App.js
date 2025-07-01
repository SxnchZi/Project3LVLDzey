import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BirthdayList from './components/BirthdayList';
import TelegramIcon from '@mui/icons-material/Telegram';
import SvgIcon from '@mui/material/SvgIcon';

const isAuthenticated = () => !!localStorage.getItem('token');

const swissTheme = createTheme({
  typography: {
    fontFamily: 'Helvetica, Arial, "Akzidenz-Grotesk BQ", "Univers", sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 900,
      letterSpacing: '-2px',
      lineHeight: 1.1,
      textTransform: 'uppercase',
    },
    h5: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-1px',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1.1rem',
      fontWeight: 400,
    },
  },
  palette: {
    background: {
      default: '#FFE4B5', 
    },
    primary: {
      main: '#B8860B', 
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFF8DC', // тёмно-синий
    },
    text: {
      primary: '#222',
      secondary: '#1d3557',
    },
  },
});

// SVG для VK (нет в стандартном MUI)
function VkIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12.004 0C5.373 0 0 5.373 0 12.004c0 6.627 5.373 12 12.004 12 6.627 0 12-5.373 12-12.004C24.004 5.373 18.631 0 12.004 0zm5.93 17.09h-1.23c-.553 0-.72-.447-1.71-1.43-.86-.84-1.23-.92-1.45-.92-.3 0-.38.09-.38.53v1.13c0 .38-.12.59-.92.59-1.7 0-3.57-1.08-4.82-3.09-1.36-2.18-1.6-3.2-1.6-3.47 0-.21.17-.33.5-.33h1.23c.38 0 .52.17.66.54.72 1.87 1.94 3.5 2.32 3.5.18 0 .25-.09.25-.54v-1.36c-.05-.97-.56-1.05-.56-1.36 0-.15.12-.29.36-.29h2.01c.33 0 .4.14.4.5v1.36c0 .31.13.41.22.41.18 0 .32-.1.65-.47.99-1.09 1.74-2.25 1.74-2.25.13-.2.27-.29.62-.29h1.23c.36 0 .44.17.36.39-.15.36-1.54 2.52-1.54 2.52-.13.2-.18.31 0 .51.13.15.57.56 1.13 1.1.7.7 1.22 1.29 1.22 1.29.18.2.13.47-.23.47z" />
    </SvgIcon>
  );
}

function App() {
  return (
    <ThemeProvider theme={swissTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="primary" elevation={5} sx={{ mb: 4 }}>
          <Toolbar sx={{ minHeight: 150, px: 10 }}>
            <Typography
              variant="h1"
              component={Link}
              to="/"
              sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontFamily: 'inherit', letterSpacing: '-2px', lineHeight: 1.05 }}
            >
              Поздравлятор
            </Typography>
            {isAuthenticated() ? (
              <Button color="inherit" size="large" sx={{ fontWeight: 700, fontSize: '1.2rem' }} onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
                Выйти
              </Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" size="large" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Вход</Button>
                <Button color="inherit" component={Link} to="/register" size="large" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Регистрация</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Box mt={3} minHeight="80vh">
          <Routes>
            <Route path="/" element={isAuthenticated() ? <BirthdayList /> : <Navigate to="/login" />} />
            <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <LoginForm onLogin={() => window.location.href = '/'} />} />
            <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <RegisterForm onRegister={() => window.location.href = '/login'} />} />
          </Routes>
        </Box>
        <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 3, mt: 6, textAlign: 'center' }}>
          <Box mb={1}>
            <Button
              href="https://t.me/sxnchzi"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ minWidth: 0, mx: 1, color: 'primary.contrastText' }}
            >
              <TelegramIcon fontSize="large" />
            </Button>
            <Button
              href="https://vk.com/sxnchzi"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ minWidth: 0, mx: 1, color: 'primary.contrastText' }}
            >
              <VkIcon fontSize="large" />
            </Button>
          </Box>
          <Typography variant="body2" sx={{ fontFamily: 'inherit', fontWeight: 700, letterSpacing: 1 }}>
            © {new Date().getFullYear()} Поздравлятор. Все права защищены.
          </Typography>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
