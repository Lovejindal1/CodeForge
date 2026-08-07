const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const app = require("./src/app");

const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

connectDB().then( () =>{

    app.listen(PORT, ()=>{
        console.log(`🚀 Server running on port ${PORT}`);
    });

});
