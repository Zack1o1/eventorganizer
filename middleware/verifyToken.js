
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv()

// Middleware to verify JWT and extract user info
const verifyToken = (req, res, next) => {
  // Get the token from the header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify the JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    console.log('successfully verified')
    next();
  });
};

export default verifyToken;