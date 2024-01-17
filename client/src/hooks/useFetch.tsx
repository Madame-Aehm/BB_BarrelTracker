import { Dispatch, useEffect, useState } from 'react'
import authHeaders from '../utils/authHeaders';
import { handleCatchError, handleNotOK } from '../utils/handleFetchFail';

interface ReturnData<T> {
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  data: T | null
  error: string
  setError: Dispatch<React.SetStateAction<string>>
  refetch: () => Promise<void>
}

const useFetch = <T,> (url: string, delay?: boolean): ReturnData<T> => {

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async() => {
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

  useEffect(() => {
    if (url){ 
      setLoading(true);
      fetchData().catch(e => {
      console.log(e); 
      setLoading(false)
    });}
    else {
      setLoading(false);
    }
  }, [url])

  return { data, loading, setLoading, error, setError, refetch: fetchData }
}

export default useFetch