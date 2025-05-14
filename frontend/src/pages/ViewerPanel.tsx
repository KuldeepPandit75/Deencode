import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Container, useTheme, useMediaQuery } from '@mui/material';
import io from 'socket.io-client';

interface Question {
  id: number;
  text: string;
  answer: string;
}

const socket = io('http://localhost:3001', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
  autoConnect: true
});

const ViewerPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [competitionStarted, setCompetitionStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = () => {
      socket.connect();
    };

    connectSocket();

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      setIsConnected(true);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('competitionStatus', (status: boolean) => {
      console.log('Competition status updated:', status);
      setCompetitionStarted(status);
    });

    socket.on('questionUpdate', (question: Question) => {
      console.log('Question updated:', question);
      setCurrentQuestion(question);
      setShowAnswer(false);
    });

    socket.on('showAnswer', () => {
      console.log('Showing answer');
      setShowAnswer(true);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('competitionStatus');
      socket.off('questionUpdate');
      socket.off('showAnswer');
      socket.disconnect();
    };
  }, []);

  const renderContent = (content: React.ReactNode) => (
    <Container maxWidth="md" sx={{ height: '70vh', py: { xs: 2, sm: 4 } }}>
      <h1 className='heading'>Deencode</h1>
      <Box
        sx={{
          height: 'calc(70vh - 120px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            width: '100%',
            maxWidth: '800px',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
          }}
        >
          {content}
        </Paper>
      </Box>
    </Container>
  );

  if (!isConnected) {
    return renderContent(
      <>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom align="center">
          Connecting to Server...
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Please make sure the backend server is running on port 3001
        </Typography>
      </>
    );
  }

  if (!competitionStarted) {
    return renderContent(
      <>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom align="center">
          Competition Has Not Started Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Please wait for the competition to begin...
        </Typography>
      </>
    );
  }

  return renderContent(
    currentQuestion && (
      <>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ mb: 3 }}
        >
          Question {currentQuestion.id}
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h2"
          sx={{
            whiteSpace: 'pre-line',
            textAlign: 'center',
            mb: 4,
            fontStyle: 'italic',
            px: { xs: 1, sm: 2 },
          }}
        >
          {currentQuestion.text}
        </Typography>
        
        {showAnswer && (
          <Box
            sx={{
              mt: 4,
              p: { xs: 2, sm: 3 },
              backgroundColor: '#e3f2fd',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              Answer: {currentQuestion.answer}
            </Typography>
          </Box>
        )}
      </>
    )
  );
};

export default ViewerPanel; 