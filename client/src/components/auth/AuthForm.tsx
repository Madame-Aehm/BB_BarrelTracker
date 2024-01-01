import { ChangeEvent, Dispatch, FormEvent, useRef, useState } from 'react'
import authStyles from '../../styles/auth.module.css'
import PinInput from './PinInput';
import { Pin, PinError, PinInputType } from '../../@types/auth';
import { shiftFocus, unfocusAll } from '../../utils/shiftFocus';
import SubmitButton from './SubmitButton';

type Props = {
  submit: (pin: string, setLoading: Dispatch<React.SetStateAction<boolean>>) => Promise<void>
  error: {
    error: PinError
    setError: Dispatch<React.SetStateAction<PinError>>
    defaultError: PinError
  }
}

const AuthForm = ({ submit, error }: Props) => {
  const pin = useRef<Pin>({ 1: "", 2: "", 3: "", 4: "" });
  const [loading, setLoading] = useState(false);


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
    setLoading(true);
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
      submit(fullPin, setLoading).catch((e) => console.log(e));
    }
  }

  return (
    <form onSubmit={handleSubmit} className={authStyles.form}>
        <label htmlFor="1">
          <h2 className={authStyles.h2}>Enter PIN:</h2>
        </label>
        <div className={authStyles.pinContainer}>
          <PinInput handleChange={handleChange} id={PinInputType.One} applyError={error.error[1]} pin={pin} />
          <PinInput handleChange={handleChange} id={PinInputType.Two} applyError={error.error[2]} pin={pin} />
          <PinInput handleChange={handleChange} id={PinInputType.Three} applyError={error.error[3]} pin={pin} />
          <PinInput handleChange={handleChange} id={PinInputType.Four} applyError={error.error[4]} pin={pin} />
        </div>
        <small className={authStyles.error}>{ error.error.message && error.error.message }</small>
        <SubmitButton loading={loading} />
      </form>
  )
}

export default AuthForm