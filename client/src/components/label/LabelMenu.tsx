/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, Dispatch, FormEvent, useEffect, useRef, useState } from 'react'
import labelStyles from '../../styles/labels.module.css'
import { unfocusAll } from '../../utils/shiftFocus';
import Button from '../Button';
import BrlNumForm from '../BrlNumForm';
import serverBaseURL from '../../utils/baseURL';

type Props = {
  setUrl: Dispatch<React.SetStateAction<string>>
  setError: Dispatch<React.SetStateAction<string>>
  loadingControl: boolean
}

const LabelMenu = ({ loadingControl, setUrl, setError }: Props) => {
  const barrel = useRef("");
  const [inputValid, setInputValid] = useState(true);
  const [loading, setLoading] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setInputValid(true);
    barrel.current = e.target.value;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    unfocusAll();
    if (!barrel.current || Number(barrel.current) < 0) {
      setError(`${!barrel.current ? "Need barrel number" : "No negatives ploise"}`);
      setInputValid(false);
      return
    } 
    setLoading("single");
    setUrl(`${serverBaseURL}/api/barrel/label/number/${barrel.current}`);
  }

  const handleAll = () => {
    setInputValid(true);
    setLoading("all");
    setUrl(`${serverBaseURL}/api/barrel/label/all`);
  }

  useEffect(() => {
    if (!loadingControl) {
      setLoading("");
    }
  }, [loadingControl])

  return (
      <div className={labelStyles.divider}>
        <div className={labelStyles.singleWrapper}>
          <BrlNumForm loading={loading} invalid={!inputValid} handleChange={handleChange} handleSubmit={handleSubmit} />
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