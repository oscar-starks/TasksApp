const { Server } = require("socket.io");
const socket_auth = require("./auth")

let io;

function initialize(server){
    io = new Server(server);

    io.use(socket_auth.authentication)

    // setting up the socket
    io.on('connection',(socket, next) => {

    socket.on("disconnect", () => {
      console.log("User disconnected")
    });

    socket.on("message", (message) => {
        console.log(message);

        // socket.broadcast.emit("message", "chicken kitchen")

        // socket.emit emits the message to the user that is connected or the user that sends the data
        // while io.emit sends the message to everyone that's connected
        // the socket.broadcast.emit sends the message to everyone except the sender
        
    });


});
}

module.exports = {
    io, initialize
}
