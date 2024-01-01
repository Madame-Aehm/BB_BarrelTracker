/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, Dispatch, FormEvent, useRef, useState } from 'react'
import labelStyles from '../../styles/labels.module.css'
import { LabelType } from '../../@types/labels';
import { NotOK } from '../../@types/auth';
import LabelGenButton from './LabelGenButton';
import { unfocusAll } from '../../utils/shiftFocus';

type Props = {
  setState: Dispatch<React.SetStateAction<LabelType[]>>
  setError: Dispatch<React.SetStateAction<string>>
}

const LabelMenu = ({ setState, setError }: Props) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const token = localStorage.getItem("token") || "";

  const barrel = useRef("");
  const [inputValid, setInputValid] = useState(true);
  const [loading, setLoading] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setInputValid(true);
    barrel.current = e.target.value;
  }

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    unfocusAll();
    await handleSingle()
  }

  const handleSingle = async() => {
    setError("");
    if (!barrel.current || Number(barrel.current) < 0) {
      setError(`${!barrel.current ? "Need barrel number" : "No negatives ploise"}`);
      setInputValid(false);
      return
    } 
    setLoading("single");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    try {
      const response = await fetch(`${serverBaseURL}/api/barrel/label/number/${barrel.current}`, { headers });
      if (response.ok) {
        const result = await response.json() as LabelType;
        setState([result]);
      } else {
        const result = await response.json() as NotOK;
        setError(result.error);
        setInputValid(false);
      }
      setLoading("");
    } catch(e) {
      const { message } = e as Error;
      setError(message);
      setLoading("");
    }
  }

  const handleAll = async() => {
    setError("");
    setInputValid(true);
    setLoading("all");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    try {
      const response = await fetch(`${serverBaseURL}/api/barrel/label/all`, { headers });
      if (response.ok) {
        const result = await response.json() as LabelType[];
        setState(result);
      } else {
        const result = await response.json() as NotOK;
        setError(result.error);
      }
      setLoading("");
    } catch(e) {
      const { message } = e as Error;
      setError(message);
      setLoading("");
    }
  }

  return (
      <div className={labelStyles.divider}>
        <form onSubmit={handleSubmit} className={labelStyles.singleWrapper}>
          <div className={labelStyles.genBarrelLabelPair}>
            <label htmlFor='barrelNumber'><h3>Barrel Number:</h3></label>
            <input 
              type='number' 
              id='barrelNumber' 
              onChange={handleChange}
              className={`${labelStyles.barrelNumberInput} ${inputValid ? "" : labelStyles.inputInvalid}`} />
          </div>
          <LabelGenButton 
            loading={loading === "single" ? true : false} 
            handleClick={handleSingle}
            title='Generate Single Label' />
          <p className={labelStyles.or}>OR</p>
        </form>
        <div className={labelStyles.allWrapper}>
          <LabelGenButton 
            loading={loading === "all" ? true : false} 
            handleClick={handleAll} 
            title='Generate All!'/>
        </div>
      </div>
  )
}

export default LabelMenu