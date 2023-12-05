const { Server } = require("socket.io");
const socket_auth = require("./auth")

let io;

function initialize(server){
    io = new Server(server);
    io.use(socket_auth.authentication)

    // setting up the socket
    io.on('connection',(socket, next) => {
        user = socket.request.headers.user 

        socket.join(user.id)

    socket.on("disconnect", () => {
      console.log("User disconnected")
    });

    socket.on("message", (message) => {
        let user_id = socket.request.headers.user.id
        let socket_id = socket.id
        
        try{
            const obj = JSON.parse(message)

            io.to(user_id).emit("message",{
                "type":"sent_data",
                "data":obj
            })

        }catch(e){

            io.to(socket_id).emit("message", {
                "type":"invalid data type",
                "message":"message sent must be of type json"
            });

        }
        

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
