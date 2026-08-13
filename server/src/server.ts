import app from "./app.js"; 
import dotenv from 'dotenv';
import pool from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer(){
    try{
      await pool.query("SELECT NOW()");
      console.log("Database Connected Successfully");
      app.listen(PORT, ()=> console.log(`Server Running on http://localhost/${PORT}`) )
    } catch(err){
       console.log("Database Connection Failed: ", err)
    }
}

startServer();