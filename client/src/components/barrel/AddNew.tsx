import PinInput from '../auth/PinInput'
import Button from '../Button'
import flexStyles from '../../styles/flexbox.module.css'
import { useRef, useState } from 'react'
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail'
import authHeaders from '../../utils/authHeaders'
import { OK } from '../../@types/auth'

type Props = {
  refetch: () => Promise<void>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNew = ({ setOpen, refetch }: Props) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const inputValue = useRef("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalid(false);
    inputValue.current = e.target.value
  }

  const handleClick = async() => {
    setError("");
    if (!inputValue.current) {
      setInvalid(true);
      setError("You must include a value!");
      return
    }
    setLoading(true);
    try {
      const headers = authHeaders();
      if (!headers) return setError("Unauthorized");
      const body = new URLSearchParams();
      body.append("number", inputValue.current);
      const response = await fetch(`${serverBaseURL}/api/barrel/add`, { headers, body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as OK;
        await refetch()
        setSuccess(result.message);
        setLoading(false);
      } else {
        await handleNotOK(response, setError, setLoading);
      }
    } catch (error) {
      handleCatchError
    }
  }

  return (
    <div className={flexStyles.vert}>
      { success ? 
        <div>
          <h2>{ success }</h2>
          <Button 
            title='OK'
            loading={false}
            styleOverride={{ width: "6rem", height: "4rem" }}
            handleClick={() => setOpen(false)} />
        </div> : 
        <>
          <p>Enter the number of new barrels you would like to create:</p>
          <PinInput handleChange={handleChange} invalid={invalid} styleOverride={{ width: "2rem" }}/>
          <Button 
            title="Add!"
            loading={loading}
            styleOverride={{ height: "4rem", width: "8rem" }}
            handleClick={handleClick} />
          <p className='error'>{ error }</p>
        </>
      }
    </div>
  )
}

export default AddNew