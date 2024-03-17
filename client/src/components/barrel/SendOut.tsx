/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, Dispatch, FormEvent, useContext, useRef, useState } from 'react'
import Button from '../Button'
import barrelStyles from '../../styles/barrel.module.css'
import { Barrel } from '../../@types/barrel'
import { useNavigate } from 'react-router-dom'
import authHeaders from '../../utils/authHeaders'
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail'
import CancelButton from './CancelButton'
import { unfocusAll } from '../../utils/shiftFocus';
import { CustomerContext } from '../../context/CustomerContext';

type Props = {
  barrel: Barrel
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  setError: Dispatch<React.SetStateAction<string>>
}

const SendOut = ({ barrel, loading, setLoading, setError }: Props) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;

  const { customers } = useContext(CustomerContext);

  const navigate = useNavigate();
  const [invalid, setInvalid] = useState({ invoice: false, customer: false });
  const inputValues = useRef({ invoice: "", customer: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("event triggered");
    if (e.target.id === "invoice") inputValues.current.invoice = e.target.value;
    if (e.target.id === "customer") inputValues.current.customer = e.target.value;
    if (invalid.customer || invalid.invoice) {
      setInvalid({ 
        invoice: e.target.id === "invoice" ? false : invalid.invoice, 
        customer: e.target.id === "customer" ? false : invalid.customer 
      })
    }
  }

  const handleConfirm = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    unfocusAll();
    setError("");
    if (!inputValues.current.customer || !inputValues.current.invoice) {
      setError("You need to enter a customer and invoice!");
      setInvalid({ 
        invoice: inputValues.current.invoice ? false : true, 
        customer: inputValues.current.customer ? false : true });
      return
    }
    setLoading(true);
    const body = JSON.stringify({
      id: barrel._id,
      sendTo: inputValues.current
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
      <h2 className={barrelStyles.rbm}>Send to:</h2> 
      <form onSubmit={handleConfirm} className={`${barrelStyles.atHome} ${barrelStyles.gap1}`}>
        <select 
          id='customer' 
          onChange={handleChange} 
          className={`${barrelStyles.input} ${invalid.customer ? "invalid" : ""}`}>
          <option value="">Choose Customer</option>
          { customers.map((c) => <option key={c._id} value={c.name}>{c.name}</option>) }
        </select>
        <input 
          id='invoice'
          className={`${barrelStyles.input} ${invalid.invoice ? "invalid" : ""}`} 
          placeholder="Enter Invoice" 
          onChange={handleChange} />
        <div className={barrelStyles.centerButton}>
          <Button 
            title='Confirm'
            loading={loading}
            styleOverride={{ width: "10rem", height: "4rem" }}
            />
          <CancelButton />
        </div>
      </form>
    </>
  )
}

export default SendOut