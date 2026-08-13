import bcrypt from 'bcrypt';
import type { RegisterBody } from './auth.types.js';
import { findUserByEmail, CreateUser } from './auth.repository.js';

export async function registerUser(user: RegisterBody){
    const existingUser = await findUserByEmail(user.email);
    if(existingUser) throw new Error("This User Already Exists");
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await CreateUser(user, hashedPassword);
    return newUser;
}