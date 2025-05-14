import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import AdminPanel from './pages/AdminPanel';
import ViewerPanel from './pages/ViewerPanel';
import Login from './pages/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/viewer" element={<ViewerPanel />} />
          <Route path="/" element={<Navigate to="/viewer" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 