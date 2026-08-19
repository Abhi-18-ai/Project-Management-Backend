import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";
import app from "./app.js";
dotenv.config(); //we can proide path of .env file in object form


const port = process.env.PORT || 3000;

connectDB()
.then(()=>{
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
}).catch((err)=>{
    console.error("😭MongoDB connection error",err)
    process.exit(1)
});

