const dotenv = require('dotenv');
dotenv.config();

const app = require("./src/app");

const connectDB = require("./src/config/database");
const { connectRedis } = require("./src/config/redis");

const PORT = process.env.PORT || 3000;

connectDB().then(async () =>{

    await connectRedis();

    app.listen(PORT, ()=>{
        console.log(`🚀 Server running on port ${PORT}`);
    });

});
