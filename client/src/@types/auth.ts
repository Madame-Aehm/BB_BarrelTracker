export type AuthOK = {
  token: string
}

export type CurrentAuth = {
  authorized: boolean
}

export type NotOK = {
  error: string
}

export enum PinInputType {
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4"
}

export interface Pin {
  [key: number]: string,
}

export interface PinError {
  [key: number]: boolean
  message: string
}