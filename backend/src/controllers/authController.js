import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../DB.js";


export const register = (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Save the user to the database
  pool.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    }
  );
};

export const login = (req, res) => {
  // Handle user login
};
