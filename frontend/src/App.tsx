import React from 'react';
import { UserList } from './components/UserList';
import { CssBaseline, ThemeProvider, createTheme, Container, Typography, Box, useMediaQuery } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center', 
          py: isMobile ? 2 : 3,
          px: isMobile ? 1 : 2
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            fontWeight="bold" 
            color="primary"
            gutterBottom
          >
            User Management
          </Typography>
          <UserList />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;