import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authenticateToken = (req, res, next) => {
  console.log("Raw authorization header:", req.headers["authorization"]);
  const token = req.headers["authorization"]?.split(' ')[1]; 
  if (!token) return res.status(401).json({ error: 'Access denied' });
  console.log("Extracted token:", token);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: err.message });
    req.user = user; 
    next();
  });
};

export { authenticateToken };
