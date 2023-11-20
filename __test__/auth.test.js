const axios =  require('axios');

test("Signup Test", async () => {
    const response = await axios.post("http://localhost:4000/auth/signup/", {
        "email": "boss82413@gmail.com",
        "fullName": "Oscar Blessed",
        "role": "admin",
        "password": "chickenkitchen",
    });

    expect(response.status).toBe(201);   
    expect(response.data).toStrictEqual({"message":"new user created" });
});

test("Login Test", async () => {
    const response = await axios.post("http://localhost:4000/auth/login/", {
        "email": "boss82413@gmail.com",
        "password": "chickenkitchen",
        });
    
    expect(response.status).toBe(200);   
    expect(typeof(response.data)).toBe("object");
    
});