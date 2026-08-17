import * as z from "zod";
import { accountSchema } from "./account.schema.js";
 
export type CreateAccountBody = z.infer<typeof accountSchema>
export type AccountType = "bank" | "cash" | "credit_card";
export interface UpdateAccountBody {
    name?: string,
    type?: AccountType
}