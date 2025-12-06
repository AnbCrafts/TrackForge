import jwt from 'jsonwebtoken';


export const generateToken = (userId) => {
  if (!userId) throw new Error("User ID is required for token generation");

  const token = jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return token;
};

 
