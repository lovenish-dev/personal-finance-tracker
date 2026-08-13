import type { Request, Response, NextFunction } from "express";
import { z, ZodType } from 'zod'

export function validate(schema: ZodType){
    return (req: Request, res:Response, next: NextFunction) =>{
      const result = schema.safeParse(req.body);
      if(!result.success){
        return res.status(400).json({ success:false, message:"Validation Failed", errors: z.treeifyError(result.error) });
      }
      req.body = result.data;
      next();
    }
}
