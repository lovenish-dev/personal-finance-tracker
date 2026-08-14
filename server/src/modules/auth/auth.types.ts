export type RegisterBody = {
    name: string,
    email: string,
    password: string
}

export type LoginBody = {
    email: string,
    password: string
}

export type ApiResponse<T> = {
    success? : boolean,
    message? : string
    data: T
}