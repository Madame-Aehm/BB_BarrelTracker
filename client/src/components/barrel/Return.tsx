/* eslint-disable @typescript-eslint/no-misused-promises */
import { Dispatch } from 'react'
import { Barrel } from '../../@types/barrel'
import barrelStyles from '../../styles/barrel.module.css'
import Button from '../Button'
import { useNavigate } from 'react-router-dom'
import authHeaders from '../../utils/authHeaders'
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail'
import CancelButton from './CancelButton'

type Props = {
  barrel: Barrel
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  setError: Dispatch<React.SetStateAction<string>>
}

function Return({ barrel, loading, setLoading, setError }: Props) {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  
  const navigate = useNavigate();

  const handleReturn = async() => {
    setError("");
    setLoading(true);
    const body = JSON.stringify({
      id: barrel._id,
      newCurrent: {
        where: "BB",
        date: new Date(),
        by: "me"
      },
      prev: barrel.current
    })
    const headers = authHeaders();
    if (!headers) return setError("Unauthorized");
    headers.append("Content-Type", "application/json");
    try {
      const response = await fetch(`${serverBaseURL}/api/barrel/return`, { headers, body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as Barrel;
        console.log(result);
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1000);
      } else {
        await handleNotOK(response, setError, setLoading);
      }
    } catch (e) {
      handleCatchError(e, setError, setLoading);
    }
  } 
  return (
    <div className={barrelStyles.moveDown}>
      <CancelButton />
      <Button 
        loading={loading} 
        title={"Mark as Returned"}
        styleOverride={{ fontSize: "x-large", height: "5rem", width: "15rem" }}
        handleClick={handleReturn} />
    </div>
  )
}

export default Return