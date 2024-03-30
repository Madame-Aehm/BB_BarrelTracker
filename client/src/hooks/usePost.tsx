import { Dispatch, useState } from 'react'
import authHeaders from '../utils/authHeaders';
import { handleCatchError, handleNotOK } from '../utils/handleFetchFail';

interface ReturnData {
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  // data: T | null
  error: string
  setError: Dispatch<React.SetStateAction<string>>
  makePostRequest: () => Promise<void>
}

interface Parameters<T> {
  url: string, 
  body: string, 
  successCallback: (result: T) => void
  delay?: boolean
}

const usePost = <T,> (params: Parameters<T>): ReturnData => {
  const { url, body, successCallback, delay } = params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const makePostRequest = async() => {
    setLoading(true);
    setError("");
    const headers = authHeaders();
    if (!headers) return setLoading(false);
    try {
      headers.append("Content-Type", "application/json");
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
        await handleNotOK(response, setError, setLoading);
      }
    } catch (e) {
      handleCatchError(e, setError, setLoading);
    }
  }


  return { loading, setLoading, error, setError, makePostRequest }
}

export default usePost