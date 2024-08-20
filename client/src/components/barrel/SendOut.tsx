/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, FormEvent, useContext, useRef, useState } from 'react'
import Button from '../Button'
import { barrelStyles } from '../../styles/styles'
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
  const [invalid, setInvalid] = useState({ suffix: false, customer: false });
  const inputValues = useRef({ prefix: "LI", suffix: "", customer: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    inputValues.current = { ...inputValues.current, [e.target.id]: e.target.value };
    if (invalid.customer || invalid.suffix) {
      setInvalid({ 
        suffix: e.target.id === "suffix" ? false : invalid.suffix, 
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
    if (!inputValues.current.customer || !inputValues.current.suffix) {
      setError("You need to enter a customer and invoice!");
      setInvalid({ 
        suffix: inputValues.current.suffix ? false : true, 
        customer: inputValues.current.customer ? false : true });
      return
    }
    const body = JSON.stringify({
      id: barrel._id,
      sendTo: {
        invoice: `${inputValues.current.prefix}${inputValues.current.suffix}`,
        customer: inputValues.current.customer
      }
    })
    await makePostRequest(body);
  }

  if (loading) return <Loading />
  return (
    <>
      <h2 className={barrelStyles.rbm}>Send to:</h2> 
      <form onSubmit={handleConfirm} className={`${barrelStyles.atHome} ${barrelStyles.gap1}`} style={{ maxWidth: "95%"}}>
        <select 
          id='customer' 
          onChange={handleChange} 
          className={`${barrelStyles.input} ${invalid.customer ? "invalid" : ""}`}>
          <option value="">Choose Customer</option>
          { customers.map((c) => <option key={c._id} value={c.name}>{c.name}</option>) }
        </select>
        <div style={{ display: "flex" }}>
          <select
            id='prefix'
            className={`${barrelStyles.input}`}
            onChange={handleChange}>
            <option value="LI">LI</option>
            <option value="RE">RE</option>
          </select>
          <input 
            style={{ minWidth: "0"}}
            type='number'
            id='suffix'
            className={`${barrelStyles.input} ${invalid.suffix ? "invalid" : ""}`} 
            placeholder="Enter Invoice" 
            onChange={handleChange} />
        </div>
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