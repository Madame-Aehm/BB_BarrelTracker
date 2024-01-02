import { Dispatch } from "react";
import { NotOK } from "../@types/auth";

const handleCatchError = (
  e: unknown, 
  setError: Dispatch<React.SetStateAction<string>>,
  setLoading?: Dispatch<React.SetStateAction<boolean>>) => {
    console.log(e);
    const { message } = e as Error;
    setError(message);
    if (setLoading) setLoading(false);
}

const handleNotOK = async(
  response: Response,
  setError: Dispatch<React.SetStateAction<string>>,
  setLoading?: Dispatch<React.SetStateAction<boolean>>) => {
  const result = await response.json() as NotOK;
  setError(result.error);
  if (setLoading) setLoading(false);
}

export { handleCatchError, handleNotOK }