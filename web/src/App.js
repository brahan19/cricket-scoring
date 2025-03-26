import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

import Home from './pages/Home';
import NewMatch from './pages/NewMatch';
import MatchDetails from './pages/MatchDetails';
import LiveScoring from './pages/LiveScoring';
import Teams from './pages/Teams';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cricket Scoring App
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/teams">
              Teams
            </Button>
            <Button color="inherit" component={Link} to="/new-match">
              New Match
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/new-match" element={<NewMatch />} />
            <Route path="/match/:id" element={<MatchDetails />} />
            <Route path="/scoring/:id" element={<LiveScoring />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
