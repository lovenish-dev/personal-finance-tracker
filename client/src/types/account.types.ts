export type AccountType = "bank" | "cash" | "credit card" ;
export type Account = {
    id: number,
    user_id: number,
    name: string,
    type: AccountType,
    balance:number,
    created_at: string,
    updated_at: string
}

export type AccountState = {
    accounts: Account[],
    loading: boolean,
    error: string | null,
}

