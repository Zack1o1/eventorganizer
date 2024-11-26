import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../db/index.js";
import { configDotenv } from "dotenv";

configDotenv();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 8;

// register user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let query = "SELECT * FROM users WHERE email = $1";
    const userExists = await client.query(query, [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "user already exits" });
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let userQuery =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email";
    const newUser = await client.query(userQuery, [name, email, hashPassword]);
    res.status(201).json({message:'user registered successfully', user: newUser.rows[0]})

  } catch (err) {
    console.error("Error registering user", err);
    res.status(500).json({ error: "Server error" });
  }
});

//login user
router.post('/login', async (req, res)=>{
    const {email, password} = req.body

    try {
        let query = 'SELECT * from users WHERE email = $1'
        const user = await client.query(query,[email])
        if(user.rows.length === 0){
            res.status(404).json({error:'wrong email'})
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        if(!validPassword){
            res.status(404).json({error:'invalid password'})
        }
        //jwt token
        const token = jwt.sign({id: user.rows[0].id,email: user.rows[0].email}, JWT_SECRET, {expiresIn:'24h'})
    
        res.status(200).json({message:'login successful', token})

    } catch (error) {
        console.error("Error loging user", error);
        res.status(500).json({ error: "Server error" });
    }
})


export default router;
