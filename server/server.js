const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4001;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const createNewRoom = 'CREATE_NEW_ROOW';
const roomCreated = 'ROOM_CREATED';
const closeRoom = 'CLOSE_ROOM';

const addToRoom = 'ADD_TO_ROOM';
const joinedToRoom = 'JOINED_TO_ROOM';
const roomNotFound = 'ROOM_NOT_FOUND';

const createdRooms = [
    {
        roomCode: '111111',
        title: 'quiz testowy'
    }
];

const getRoomObject = (roomCode) => {
   return createdRooms.find(room => {
       return room.roomCode.toString() === roomCode.toString();
   });
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

io.on('connection', socket => {
    console.log(socket.id + ' > user connected');

    //CREATING NEW ROOM BY HOST
    socket.on(createNewRoom, (data) => {
        let code = 0;
        while(true) {
            code = getRandomInt(100000, 999999);
            if(!getRoomObject(code)) break;
        }
        code = code.toString();
        createdRooms.push({
           roomCode: code,
           title: data.title
        });
        socket.join(code);
        socket.emit(roomCreated, code);
        console.log(socket.id + ' > user created a new room with code ' + code + ' and title "' + data.title + '" (active rooms: ' + createdRooms.length + ')');
    });

    //CLOSING ROOM BY HOST
    socket.on(closeRoom, (code) => {
        const i = createdRooms.findIndex(room => {
            return room.roomCode.toString() === code.toString();
        });
        if(i > -1) {
            createdRooms.splice(i, 1);
            console.log(socket.id + ' > user closed the room with code ' + code + ' (active rooms: ' + createdRooms.length + ')');
        }
    });

    //ADDING NEW USER TO THE ROOM
    socket.on(addToRoom, (roomCode, playerName) => {
        if(getRoomObject(roomCode)) {
            socket.nickname = playerName;
            socket.join(roomCode);
            socket.emit(joinedToRoom, getRoomObject(roomCode));
            console.log(socket.id + ' > user joined to room ' + roomCode + ' with nickname ' + socket.nickname + ' (players in room: ' + io.sockets.adapter.rooms[roomCode].length + ')');
        }else{
            socket.emit(roomNotFound);
            console.log(socket.id + ' > room with code ' + roomCode + ' not found!');
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' > user disconnected');
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));