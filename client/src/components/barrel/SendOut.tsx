/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, FormEvent, useContext, useRef, useState } from 'react'
import Button from '../Button'
import barrelStyles from '../../styles/barrel.module.css'
import { Barrel } from '../../@types/barrel'
import { useNavigate } from 'react-router-dom'
import CancelButton from './CancelButton'
import { unfocusAll } from '../../utils/shiftFocus';
import { CustomerContext } from '../../context/CustomerContext';
import serverBaseURL from '../../utils/baseURL'
import usePost from '../../hooks/usePost'
import Loading from '../Loading'

type Props = {
  barrel: Barrel
}

const SendOut = ({ barrel }: Props) => {
  const { customers } = useContext(CustomerContext);
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState({ invoice: false, customer: false });
  const inputValues = useRef({ invoice: "", customer: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    inputValues.current = { ...inputValues.current, [e.target.id]: e.target.value };
    if (invalid.customer || invalid.invoice) {
      setInvalid({ 
        invoice: e.target.id === "invoice" ? false : invalid.invoice, 
        customer: e.target.id === "customer" ? false : invalid.customer 
      })
    }
  }

  const { loading, error, setError, makePostRequest } = usePost({
    url: `${serverBaseURL}/api/barrel/send`,
    successCallback: (result) => {
      console.log(result);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    delay: true
  })

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
    const body = JSON.stringify({
      id: barrel._id,
      sendTo: inputValues.current
    })
    makePostRequest(body);
  }

  console.log(inputValues)

  if (loading) return <Loading />
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
        { error && <p className='error'><small>{ error }testing testing</small></p> }
      </form>
    </>
  )
}

export default SendOut