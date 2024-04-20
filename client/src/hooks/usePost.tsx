import { Dispatch, useState } from 'react'
import authHeaders from '../utils/authHeaders';
import { handleCatchError, handleNotOK } from '../utils/handleFetchFail';

interface ReturnData {
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  // data: T | null
  error: string
  setError: Dispatch<React.SetStateAction<string>>
  makePostRequest: (body: string | FormData,) => Promise<void>
}

interface Parameters<T> {
  url: string, 
  successCallback: (result: T) => void
  failCallback?: (error: string) => void
  delay?: boolean
}

const usePost = <T,> (params: Parameters<T>): ReturnData => {
  const { url, successCallback, failCallback, delay } = params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const makePostRequest = async(body: string | FormData,) => {
    console.log("sending this body", body);
    setLoading(true);
    setError("");
    const headers = authHeaders();
    if (!headers) return setLoading(false);
    try {
      if (typeof body === "string") headers.append("Content-Type", "application/json");
      const response = await fetch(url, { headers, body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as T;
        console.log(result);
        successCallback(result);
        if (delay === true) {
          setTimeout(() => {
            setLoading(false)
          }, 1000);
        } else setLoading(false)
      } else {
        const error = await handleNotOK(response, setError, setLoading);
        if (failCallback) failCallback(error);
      }
    } catch (e) {
      const error = handleCatchError(e, setError, setLoading);
      if (failCallback) failCallback(error);
    }
  }


  return { loading, setLoading, error, setError, makePostRequest }
}

export default usePost