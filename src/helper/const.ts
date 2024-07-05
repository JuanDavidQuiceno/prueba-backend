import { Request } from "express";

export interface IToken {
  ius: string,
  rs: string
}

export interface IRequest extends Request {
  user: IToken
}

export interface IDynamic {
  [key: string]: IDynamic
}