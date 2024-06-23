const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const db = require('./db')
const cors = require('cors');
const Message = require('./src/Models/massagesModel')
const verifyJWT = require('./src/Middleware/auth')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());





// app.get('/messages', async (req, res) => {
//     const messages = await Message.find().sort({ timestamp: 1 });
//     res.json(messages);
// });

app.post('/messages', verifyJWT, async (req, res) => {
    // console.log(req, req.body)
    const {sender, receiver } = req.body
    const messages = await Message.find({
        $or: [
          { sender : sender, receiver :  receiver },
          { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
});




io.on('connection', (socket) => {
    console.log('New client connected');
  
    // Handle user joining the chat
    socket.on('join', ({ userName }) => {
      console.log("IN JOIN:", userName);
      socket.username = userName;  // Store the username in the socket object
      socket.join(userName);       // Join a room with the user's username
    });
  
    // Handle sending messages
    socket.on('sendMessage', async ({ receiver, message }) => {
      console.log("USER NAME SENDER:", socket.username);  // Log the sender's username
  
      if (!socket.username) {
        console.error("Username not set for the socket");
        return;
      }
  
      const newMessage = { sender: socket.username, receiver, message };
  
      try {
        const msg = new Message(newMessage);
        await msg.save();
  
        // Emit the message to the receiver's room
        io.to(receiver).emit('message', newMessage);
  
        // Emit the message to the sender's room (for immediate feedback)
        io.to(socket.username).emit('message', newMessage);
  
        console.log(`Message from ${socket.username} to ${receiver}: ${message}`);
      } catch (err) {
        console.error('Error saving message to database', err);
      }
    });
  
    // Handle client disconnecting
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  



// aAPI -------------------

const user = require('./src/Routes/UserRoutes')
app.use('/user', user)



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
