import * as z from "zod";
import { accountSchema } from "./account.schema.js";
 
export type CreateAccountBody = z.infer<typeof accountSchema>