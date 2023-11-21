const axios =  require('axios');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});

test("Signup Test", async () => {
    const response = await axios.post("http://localhost:4000/auth/signup/", {
        "email": process.env.TEST_EMAIL,
        "fullName": "Oscar Blessed",
        "role": "admin",
        "password": process.env.TEST_PASSWORD,
    });

    expect(response.status).toBe(201);   
    expect(response.data).toStrictEqual({"message":"new user created" });
});

test("Login Test", async () => {
    const response = await axios.post("http://localhost:4000/auth/login/", {
        "email": process.env.TEST_EMAIL,
        "password": process.env.TEST_PASSWORD,
        });
    
    expect(response.status).toBe(200);   
    expect(typeof(response.data)).toBe("object");
    
});