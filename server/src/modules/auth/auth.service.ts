import bcrypt from 'bcrypt';
import type { RegisterBody } from './auth.types.js';
import { findUserByEmail, CreateUser } from './auth.repository.js';
import { AppError } from '../../utils/Apperror.js';
import { generateToken } from '../../config/jwt.js';

export async function registerUser(user: RegisterBody){
    const existingUser = await findUserByEmail(user.email);
    if(existingUser) throw new AppError("This User Already Exists", 409);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await CreateUser(user, hashedPassword);
    return newUser;
}

export async function loginUser(email: string, password: string){
   const user = await findUserByEmail(email);
   if(!user) throw new AppError("Invalid email or password", 401);
   const passwordMatch = await bcrypt.compare(password, user.password);
   if(!passwordMatch) throw new AppError("Invalid email or password", 401); 
   const token = generateToken(user.id);
   const { password: _, ...safeuser } = user;
   return { user: safeuser, token }
}