/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, Dispatch, FormEvent, useRef, useState } from 'react'
import labelStyles from '../../styles/labels.module.css'
import { LabelType } from '../../@types/labels';
import { unfocusAll } from '../../utils/shiftFocus';
import Button from '../Button';
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail';
import BrlNumForm from '../BrlNumForm';

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
        await handleNotOK(response, setError);
        setInputValid(false);
      }
      setLoading("");
    } catch(e) {
      handleCatchError(e, setError);
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
        await handleNotOK(response, setError);
      }
      setLoading("");
    } catch(e) {
      handleCatchError(e, setError);
      setLoading("");
    }
  }

  return (
      <div className={labelStyles.divider}>
        <div className={labelStyles.singleWrapper}>
          <BrlNumForm invalid={!inputValid} handleChange={handleChange} handleSubmit={handleSubmit} />
          <p className={labelStyles.or}>OR</p>
        </div>
        <div className={labelStyles.allWrapper}>
          <Button
            loading={loading === "all" ? true : false} 
            handleClick={handleAll} 
            title='Generate All!'
            styleOverride={{ width: "12rem", height: "3.5rem" }} />
        </div>
      </div>
  )
}

export default LabelMenu