const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    // नया प्लेयर जुड़ने पर
    players[socket.id] = { x: 200, y: 200, health: 100 };
    io.emit('updatePlayers', players);

    // प्लेयर की मूवमेंट रिसीव करना
    socket.on('playerMove', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].health = data.health;
            socket.broadcast.emit('updatePlayers', players);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));