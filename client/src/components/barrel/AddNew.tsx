import PinInput from '../auth/PinInput'
import Button from '../Button'
import flexStyles from '../../styles/flexbox.module.css'
import { useEffect, useRef, useState } from 'react'
import { OK } from '../../@types/auth'
import serverBaseURL from '../../utils/baseURL'
import usePost from '../../hooks/usePost'

type Props = {
  refetch: () => Promise<void>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNew = ({ refetch, open, setOpen }: Props) => {
  const inputValue = useRef("");
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalid(false);
    inputValue.current = e.target.value
  }

  const { error, setError, loading, makePostRequest } = usePost<OK>({
    url: `${serverBaseURL}/api/barrel/add`,
    successCallback: async(result) => {
      await refetch();
      setSuccess(result.message);
    }
  })

  const handleClick = async() => {
    setError("");
    if (!inputValue.current) {
      setInvalid(true);
      setError("You must include a value!");
      return
    }
    const body = JSON.stringify({ number: inputValue.current });
    makePostRequest(body);
  }

  useEffect(() => {
    if (!open) {
      if (invalid) setInvalid(false);
      if (success) setSuccess("");
      if (inputValue.current) {
        inputValue.current = "";
        const input = document.querySelector("input");
        if (input) input.value = "";
      };
    }
  }, [open])

  return (
    <div className={flexStyles.vert}>
      { success ? 
        <div>
          <h2>{ success }</h2>
          <Button 
            title='OK'
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