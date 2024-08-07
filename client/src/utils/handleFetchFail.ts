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
    return message
}

const handleNotOK = async(
  response: Response,
  setError: Dispatch<React.SetStateAction<string>>,
  setLoading?: Dispatch<React.SetStateAction<boolean>>) => {
  const result = await response.json() as NotOK;
  console.log(result);
  setError(result.error);
  if (setLoading) setLoading(false);
  return result.error
}

export { handleCatchError, handleNotOK }