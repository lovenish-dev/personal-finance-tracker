import jwt from 'jsonwebtoken';
 
const JWT_SECRET = process.env.JWT_SECRET as string;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}

export function generateToken(userId: number): string{
    return jwt.sign({ userId }, JWT_SECRET, {expiresIn: "1D"})
}