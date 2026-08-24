export type RegisterBody = {
    name: string,
    email: string,
    password: string
}

export type LoginBody = {
    email: string,
    password: string
}

export type User = {
    id: number,
    name: string,
    email: string,
}

export type AuthResponse = {
    success: boolean,
    message: string,
    data: {
        user: User,
        token: string
    }
}