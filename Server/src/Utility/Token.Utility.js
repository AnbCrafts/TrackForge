import jwt from 'jsonwebtoken';
import Config from '../Config/Config.js'; // ensure it ends in .js or .ts depending on your setup

export const generateToken = (userId) => {
  if (!userId) throw new Error("User ID is required for token generation");

  const token = jwt.sign(
    { id: userId }, 
    Config.JWT_SECRET, 
    { expiresIn: Config.JWT_EXPIRES_IN || '7d' }
  );

  return token;
};

 
