import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import io from 'socket.io-client';

interface Question {
  id: number;
  text: string;
  answer: string;
}

const socket = io('https://deencode.onrender.com', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
  autoConnect: true
});

const AdminPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [competitionStarted, setCompetitionStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

    socket.on('questionsUpdate', (updatedQuestions: Question[]) => {
      console.log('Questions updated:', updatedQuestions);
      setQuestions(updatedQuestions);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('questionsUpdate');
      socket.disconnect();
    };
  }, []);

  const handleStartCompetition = () => {
    console.log('Starting competition');
    setCompetitionStarted(true);
    setCurrentQuestionIndex(0);
    socket.emit('startCompetition');
  };

  const handleEndCompetition = () => {
    console.log('Ending competition');
    setCompetitionStarted(false);
    socket.emit('endCompetition');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      socket.emit('nextQuestion');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      socket.emit('previousQuestion');
    }
  };

  const handleShowAnswer = () => {
    socket.emit('showAnswer');
  };

  const renderContent = (content: React.ReactNode) => (
    <Container maxWidth="md" sx={{ height: '100vh', py: { xs: 2, sm: 4 } }}>
      <Box sx={{ height: 'calc(100vh - 120px)', px: { xs: 1, sm: 2 } }}>
        {content}
      </Box>
    </Container>
  );

  if (!isConnected) {
    return renderContent(
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            width: '100%',
            maxWidth: '800px',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
            Connecting to Server...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please make sure the backend server is running on port 3001
          </Typography>
        </Paper>
      </Box>
    );
  }

  return renderContent(
    <Stack spacing={3}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          Admin Control Panel
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ flexWrap: 'wrap', gap: 2 }}
        >
          <Button
            variant="contained"
            color={competitionStarted ? 'error' : 'success'}
            onClick={competitionStarted ? handleEndCompetition : handleStartCompetition}
            fullWidth={isMobile}
          >
            {competitionStarted ? 'End Competition' : 'Start Competition'}
          </Button>
          {competitionStarted && (
            <>
              <Button
                variant="contained"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                fullWidth={isMobile}
              >
                Previous Question
              </Button>
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                fullWidth={isMobile}
              >
                Next Question
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowAnswer}
                fullWidth={isMobile}
              >
                Show Answer
              </Button>
            </>
          )}
        </Stack>
      </Paper>

      {competitionStarted && questions[currentQuestionIndex] && (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
            Current Question ({currentQuestionIndex + 1} of {questions.length})
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              mb: 2,
              fontStyle: 'italic',
              px: { xs: 1, sm: 2 },
            }}
          >
            {questions[currentQuestionIndex].text}
          </Typography>
          <Box
            sx={{
              mt: 2,
              p: { xs: 2, sm: 3 },
              backgroundColor: '#e3f2fd',
              borderRadius: 2,
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              Answer: {questions[currentQuestionIndex].answer}
            </Typography>
          </Box>
        </Paper>
      )}
    </Stack>
  );
};

export default AdminPanel; 