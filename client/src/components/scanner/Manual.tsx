import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { barrelStyles } from '../../styles/styles';
import BrlNumForm from '../BrlNumForm';
import { unfocusAll } from '../../utils/shiftFocus';
import { useNavigate } from 'react-router-dom';

const Manual = () => {
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState("");
  const barrel = useRef("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setInvalid(false);
    barrel.current = e.target.value;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    unfocusAll();
    if (!barrel.current || Number(barrel.current) <= 0) {
      setInvalid(true);
      setError(!barrel.current ? "Need a barrel number" : "No negative numbers ploise")
    } else {
      navigate(`/barrel/update/${barrel.current}`);
    }
  }

  return (
    <div>
      <p className={barrelStyles.error}>{ error }</p>
      <BrlNumForm invalid={invalid} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  )
}

export default Manual