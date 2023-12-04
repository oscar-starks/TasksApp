const authMiddleWare = require('../middlewares/auth');


const authentication = async function(socket, next) {
    const token = socket.request.headers.token;
    const {user_details,error} = await authMiddleWare.socketAuthMiddleware(token);

    if (error != null) {
        err = new Error("authorization failed");
        next(err);

    }
    else{
        socket.request.headers.user = user_details;
        next();

     }
   
};


module.exports = {
    authentication
}


