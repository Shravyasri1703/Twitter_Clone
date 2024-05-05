import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

export const protectRoute = async (req, res, next) => {
   try {
    
      const token = req.cookies.jwt;
      if (!token) {
        res.status(401).send('Unauthorized: No token provided');
        return;
      } 
      
      let decode;
      try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
       
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
      
      if (!decode || !decode.userid) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const user = await User.findById(decode.userid).select('-password');
      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      req.user = user;
      next();
   } catch (err) {
      console.error('Error in protectRoute middleware:', err.message);
      res.status(500).send('Internal Server Error');
   }
}
