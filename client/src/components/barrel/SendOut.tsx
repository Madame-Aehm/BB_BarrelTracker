/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, Dispatch, useState } from 'react'
import customers from '../../customers.json';
import Button from '../Button'
import barrelStyles from '../../styles/barrel.module.css'
import { Barrel } from '../../@types/barrel'
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

const SendOut = ({ barrel, loading, setLoading, setError }: Props) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;

  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);
  const [inputValues, setInputValues] = useState({ invoice: "", customer: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e.target.id, e.target.value)
    setInputValues({  ...inputValues, [e.target.id]: e.target.value })
    setInvalid(false);
  }

  const handleConfirm = async() => {
    setError("");
    if (!inputValues.customer || !inputValues.invoice) {
      setError("You need to enter a customer!");
      setInvalid(true);
      return
    }
    setLoading(true);
    const body = JSON.stringify({
      id: barrel._id,
      sendTo: inputValues
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
          navigate("/");
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
      <div className={barrelStyles.atHome}>
        {/* <input 
          className={`${barrelStyles.input} ${invalid ? barrelStyles.invalid : ""}`} 
          list='customers' 
          placeholder="Enter customer" 
          onChange={handleChange} />
          <datalist id='customers'>
            <option value="Customer One" />
            <option value="Customer Two" />
            <option value="Customer Three" />
          </datalist> */}
          <select id='customer' onChange={handleChange}>
            { customers.map((c) => <option key={c.customer} value={c.customer}>{c.customer}</option>) }
          </select>
          <input 
            id='invoice'
            className={`${barrelStyles.input} ${invalid ? barrelStyles.invalid : ""}`} 
            placeholder="Enter Invoice" 
            onChange={handleChange} />
          <span className={barrelStyles.centerButton}>
            <CancelButton />
            <Button 
              title='Confirm'
              loading={loading}
              handleClick={handleConfirm} 
              styleOverride={{ width: "10rem", height: "4rem", fontSize: "x-large" }}
              />
          </span>
      </div>
    </>
  )
}

export default SendOut