const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const rooms = {};
const users = {};


app.get('/',(req,res)=>{
   res.send("Hello");
})

io.on("connection", (socket) => {
    console.log("User Connected " + socket.id);

    socket.on('disconnect', () => {
        Object.keys(rooms).map(meetingId => {
            rooms[meetingId].users = rooms[meetingId].users.filter(x => x !== socket.id)
        })
        delete users[socket.id];
    })

    socket.on("join", (params) => {
        const meetingId = params.meetingId;
        users[socket.id] = {
            meetingId
        }

        if (!rooms[meetingId]) {
            rooms[meetingId] = {
                meetingId,
                users: []
            }
        }
        rooms[meetingId].users.push(socket.id);
    })


    socket.on("localDescription", (params) => {
        let meetingId = users[socket.id].meetingId;
        let otherUsers = rooms[meetingId].users;

        console.log(otherUsers, "otherUsers" , socket.id , "socketId")

        otherUsers.forEach((otherUser) => {
            if (otherUser !== socket.id) {
                console.log(otherUser)
                io.to(otherUser).emit("localDescription" , {
                    description : params.description
                })
            }
        })
    })

    socket.on("remoteDescription", (params) => {
        let meetingId = users[socket.id].meetingId;
        let otherUsers = rooms[meetingId].users;

        otherUsers.forEach(otherUser => {
            if (otherUser !== socket.id) {
                io.to(otherUser).emit("remoteDescription", {
                    description: params.description
                })
            }
        })
    });



    socket.on("iceCandidate", (params) => {
        let meetingId = users[socket.id].meetingId;
        let othersUsers = rooms[meetingId].users;

        othersUsers.forEach((otherUser) => {
            if (otherUser !== socket.id) {
                io.to(otherUser).emit("iceCandidate", {
                    candidate: params.candidate
                })
            }
        })
    });


    socket.on("iceCandidateReply", (params) => {
        let meetingId = users[socket.id].meetingId;
        let othersUsers = rooms[meetingId].users;

        othersUsers.forEach((otherUser) => {
            if (otherUser !== socket.id) {
                io.to(otherUser).emit("iceCandidateReply", {
                    candidate: params.candidate
                })
            }
        })
    });
})

const PORT = 4000;

server.listen(PORT, () => {
    console.log("Server successfully started")
})

