const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");
const formatMessage = require("./utilitiy/messages");
const { userJoin, getUser, getUserList, userLeave } = require("./utilitiy/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chatRoomAdmin = "Admin";
//set static folder the html shit lol
app.use(express.static(path.join(__dirname, "public")));

//runs when we connect clients to it
io.on("connection", (socket) => {
    //io is basically an open door that allow
    //for server and client to hola at each other
    console.log("New connection to chatroom");

    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit("message", formatMessage(chatRoomAdmin, "WelCome Peasant"));
         
        //BroadCast to the world when a user connects
         //everyone but me basivally
        socket.broadcast.to(user.room).emit(
            "message",
            formatMessage(chatRoomAdmin, "A peasant "+ `${user.username}`+" joined chat")
        );
       
        //send users and room info

        io.to(user.room).emit('userRoom', {
            room: user.room,
            users: getUserList(user.room)
        })
    });



    //listen for chat message;
    socket.on("chatMessage", (msg) => {
    const user = getUser(socket.id);

        //console.log(msg); //display message in server
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });


    //Runs when client  logoff
    socket.on("disconnect", () => {
    const user = userLeave(socket.id)
        if(user){
        io.to(user.room).emit("message",formatMessage(chatRoomAdmin, "A peasant has left the royal domain"));

        //reset user list
        io.to(user.room).emit('userRoom', {
            room: user.room,
            users: getUserList(user.room)
        });
    }
    
    });

});

const PORT = 8080 || process.env.PORT;

// app.listen(PORT, ()=> console.log(`server is now running on port ${PORT}`));
server.listen(PORT, () => console.log(`server is now running on port ${PORT}`));
