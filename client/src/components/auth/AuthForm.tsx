import { ChangeEvent, Dispatch, FormEvent, useRef } from 'react'
import authStyles from '../../styles/auth.module.css'
import PinInput from './PinInput';
import { Pin, PinError, PinInputType } from '../../@types/auth';
import { shiftFocus, unfocusAll } from '../../utils/shiftFocus';
import Button from '../Button';

type Props = {
  submit: (pin: string) => Promise<void>
  loading: boolean
  error: {
    error: PinError
    setError: Dispatch<React.SetStateAction<PinError>>
    defaultError: PinError
  }
}

const AuthForm = ({ submit, error, loading }: Props) => {
  const pin = useRef<Pin>({ 1: "", 2: "", 3: "", 4: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(-1);
    }
    pin.current = { ...pin.current, [e.target.id]: e.target.value }
    if (error.error[Number(e.target.id)] === true) error.setError({ ...error.error, [e.target.id]: false });
    if (e.target.value.length && e.target.id !== "4") {
      shiftFocus(Number(e.target.id));
    } 
    else if (e.target.value.length && e.target.id === "4") {
      handleSubmit();
    }
  }

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    error.setError(error.defaultError);
    unfocusAll();
    const fullPin = Object.values(pin.current).join("");

    if (fullPin.length !== 4) {
      const invalid = [];
      for (const property in pin.current) {
        if (!pin.current[property] || pin.current[property].length > 1) {
          invalid.push(Number(property));
        }
      }
      const newError:PinError = {
        message: `PIN must have 4 digits (you've sent ${fullPin.length})`
      };
      invalid.forEach((mn) => newError[mn] = true);
      error.setError({ ...error.error, ...newError });
    } else {
      submit(fullPin).catch((e) => console.log(e));
    }
  }

  return (
    <form onSubmit={handleSubmit} className={authStyles.form}>
        <label htmlFor="1">
          <h2 className={authStyles.h2}>Enter PIN:</h2>
        </label>
        <div className={authStyles.pinContainer}>
          <PinInput handleChange={handleChange} id={PinInputType.One} invalid={error.error[1]} pin={pin} />
          <PinInput handleChange={handleChange} id={PinInputType.Two} invalid={error.error[2]} pin={pin} />
          <PinInput handleChange={handleChange} id={PinInputType.Three} invalid={error.error[3]} pin={pin} />
          <PinInput handleChange={handleChange} id={PinInputType.Four} invalid={error.error[4]} pin={pin} />
        </div>
        <small className={authStyles.error}>{ error.error.message && error.error.message }</small>
        <Button 
          loading={loading} 
          title={"OK"}
          height='3.5rem'
          width='5.5rem' />
      </form>
  )
}

export default AuthForm