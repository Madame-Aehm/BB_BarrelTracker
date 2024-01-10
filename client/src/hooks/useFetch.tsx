import { Dispatch, useEffect, useState } from 'react'
import authHeaders from '../utils/authHeaders';
import { handleCatchError, handleNotOK } from '../utils/handleFetchFail';

interface ReturnData<T> {
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  data: T | null
  error: string
  setError: Dispatch<React.SetStateAction<string>>
}

const useFetch = <T,> (url: string, delay?: boolean): ReturnData<T> => {

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      setData(null);
      setError("");
      const headers = authHeaders();
      if (!headers) return setLoading(false);
      try {
        const response = await fetch(url, { headers });
        if (response.ok) {
          const result = await response.json() as T;
          console.log(result);
          setData(result);
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
    if (url) fetchData().catch(e => {console.log(e); setLoading(false)});
  }, [url, delay])

  return { data, loading, setLoading, error, setError }
}

export default useFetch