/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, Dispatch, useState } from 'react'
import Button from '../Button'
import barrelStyles from '../../styles/barrel.module.css'
import { Barrel } from '../../@types/barrel'
import { useLocation, useNavigate } from 'react-router-dom'
import authHeaders from '../../utils/authHeaders'
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail'

type Props = {
  barrel: Barrel
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  setError: Dispatch<React.SetStateAction<string>>
}

const SendOut = ({ barrel, loading, setLoading, setError }: Props) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;

  const navigate = useNavigate();
  const location = useLocation();
  const [invalid, setInvalid] = useState(false);
  const [customer, setCustomer] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomer(e.target.value);
    setInvalid(false);
  }

  const handleConfirm = async() => {
    setError("");
    if (!customer) {
      setError("You need to enter a customer!");
      setInvalid(true);
      return
    }
    setLoading(true);
    const body = JSON.stringify({
      id: barrel._id,
      newCurrent: {
        where: customer,
        date: new Date(),
        by: "me"
      },
      prev: barrel.current
    })
    const headers = authHeaders();
    if (!headers) return setError("Unauthorized");
    headers.append("Content-Type", "application/json");
    try {
      const response = await fetch(`${serverBaseURL}/api/barrel/send`, { headers, body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as Barrel;
        console.log(result);
        setTimeout(() => {
          setLoading(false);
          navigate("/", { state: location.state ? location.state as string : null });
        }, 1000);
      } else {
        await handleNotOK(response, setError, setLoading);
      }
    } catch(e) {
      handleCatchError(e, setError, setLoading);
    }
  }

  return (
    <>
      <div className={barrelStyles.displayCurrent}>
        <h2>Send to:</h2>
        <h2>{ customer }</h2>
      </div>
      <div className={barrelStyles.atHome}>
        <input 
          className={`${barrelStyles.input} ${invalid ? barrelStyles.invalid : ""}`} 
          list='customers' 
          placeholder="Enter customer" 
          onChange={handleChange} />
          <datalist id='customers'>
            <option value="Customer One" />
            <option value="Customer Two" />
            <option value="Customer Three" />
          </datalist>
          <span className={barrelStyles.centerButton}>
            <Button 
              title='Confirm'
              loading={loading}
              handleClick={handleConfirm} 
              width='10rem'
              height='4rem'
              fontSize='x-large'
              />
          </span>
      </div>
    </>
  )
}

export default SendOut