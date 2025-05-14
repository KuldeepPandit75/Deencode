const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.use(cors());
app.use(express.json());

const questions = [
  {
    id: 1,
    text: "I'm not a thief, but I hide in code,\nCause havoc and then I explode.\nProtect your system, don't be lax,\nOr I might just launch an attack.",
    answer: "Virus / Malware"
  },
  {
    id: 2,
    text: "I border seven nations, my peak's the highest,\nI test your strength if you're the wisest.\nI'm cold and tall and touch the sky,\nClimbers come but many die.",
    answer: "Mount Everest"
  },
  {
    id: 3,
    text: "I speak without a mouth and hear without ears.\nI have no body, but I come alive with peers.\nWhat am I?",
    answer: "Echo"
  },
  {
    id: 4,
    text: "I can store gigabytes, yet I'm not a brain.\nYou save your work here, again and again.\nI'm not alive, but I help your PC stay smart.\nGuess who I am, I play a major part?",
    answer: "Hard Drive / SSD"
  },
  {
    id: 5,
    text: "I go around the Earth but stay in place.\nI'm vital for calls and outer space.\nFrom GPS to streaming I pave the way,\nGuess what I am today?",
    answer: "Satellite"
  },
  {
    id: 6,
    text: "I'm tall when I'm young, short when I'm old.\nEvery birthday, my story's told.",
    answer: "Candle"
  },
  {
    id: 7,
    text: "I run inside your phone or PC,\nI'm the heart that you rarely see.\nI follow code, do what I'm told,\nWithout me, your tech would fold.",
    answer: "Processor / CPU"
  },
  {
    id: 8,
    text: "The more you take from me, the bigger I become.\nBe careful where you step, don't be dumb!",
    answer: "Hole"
  },
  {
    id: 9,
    text: "I have a name that sounds like an insect,\nBut I power the web, so you'd better respect.\nI crawl and index what's there to be found,\nHelping search engines when they look around.",
    answer: "Web Crawler / Bot"
  },
  {
    id: 10,
    text: "I have keys but no locks,\nI have space but no room.\nYou can enter but not go outside.\nWhat am I?",
    answer: "Keyboard"
  },
  {
    id: 11,
    text: "You write me in Python, C or Java,\nI'm not a poem, not a drama.\nI solve problems with some flair,\nBut one bug, and I'm pulling your hair!",
    answer: "Code / Program"
  },
  {
    id: 12,
    text: "This Indian invented zero,\nThough not a superhero.\nAn ancient mind, sharp and sound,\nHis genius still echoes around.",
    answer: "Aryabhata"
  },
  {
    id: 13,
    text: "I'm not a car, but I have a drive.\nI store your data and help it survive.\nPen-shaped, slim, and easy to tote,\nPlug me in to see me float.",
    answer: "Pen Drive / USB"
  },
  {
    id: 14,
    text: "You click on me to browse and explore,\nI open folders, files, and more.\nInside your PC, I'm the guide,\nTo everything your system hides.",
    answer: "File Explorer"
  },
  {
    id: 15,
    text: "My first name is \"artificial,\"\nMy second name is \"intelligence.\"\nI learn from data, don't you see?\nNow tell me, what am I, precisely?",
    answer: "AI"
  },
  {
    id: 16,
    text: "I transmit data, near or far,\nInvisible but strong — that's what I are.\nYou use me daily, I'm quite the norm,\nConnecting you without a form.",
    answer: "Wi-Fi"
  },
  {
    id: 17,
    text: "I live in layers, I make things bright,\nWithout me, your phone has no sight.\nTouch and scroll, I help you play,\nGuess who I am right away.",
    answer: "Touchscreen / Display"
  },
  {
    id: 18,
    text: "I'm five bytes long and quite polite,\nMy binary form is black and white.\n01001000 01100101 01101100 01101100 01101111 —\nDecode me right and greet the light.\nWhat word am I?",
    answer: "Hello"
  },
  {
    id: 19,
    text: "A chip off the moon, yet full of fire,\nIndia reached me and didn't tire.\nWith Vikram lander, I touched ground,\nIn space history, I made a sound.",
    answer: "Chandrayaan-3"
  },
  {
    id: 20,
    text: "I'm not a room, but I'm filled with space.\nData centers are my resting place.\nYou can store and share with ease,\nJust upload me on the breeze.",
    answer: "Cloud"
  }
];

let competitionStarted = false;
let currentQuestionIndex = 0;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial state to new connections
  socket.emit('competitionStatus', competitionStarted);
  socket.emit('questionsUpdate', questions);
  if (competitionStarted && questions[currentQuestionIndex]) {
    console.log('Sending initial question to new connection:', questions[currentQuestionIndex]);
    socket.emit('questionUpdate', questions[currentQuestionIndex]);
  }

  socket.on('startCompetition', () => {
    console.log('Competition started by:', socket.id);
    competitionStarted = true;
    currentQuestionIndex = 0;
    console.log('Broadcasting competition status and first question');
    io.emit('competitionStatus', true);
    io.emit('questionUpdate', questions[currentQuestionIndex]);
  });

  socket.on('endCompetition', () => {
    console.log('Competition ended by:', socket.id);
    competitionStarted = false;
    io.emit('competitionStatus', false);
  });

  socket.on('nextQuestion', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      console.log('Moving to next question:', questions[currentQuestionIndex]);
      io.emit('questionUpdate', questions[currentQuestionIndex]);
    }
  });

  socket.on('previousQuestion', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      console.log('Moving to previous question:', questions[currentQuestionIndex]);
      io.emit('questionUpdate', questions[currentQuestionIndex]);
    }
  });

  socket.on('showAnswer', () => {
    console.log('Showing answer for question:', currentQuestionIndex + 1);
    io.emit('showAnswer');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 