import { useContext, useEffect, useRef, useState } from "react";
import usePost from "../../hooks/usePost";
import { Customer } from "../../@types/customer";
import serverBaseURL from "../../utils/baseURL";
import { CustomerContext } from "../../context/CustomerContext";
import Button from "../Button";
import { barrelStyles } from "../../styles/styles";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
}


const AddNew = ({ open, setOpen }: Props) => {
  const { setCustomers } = useContext(CustomerContext);
  const inputValue = useRef("");
  const [invalid, setInvalid] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalid("");
    inputValue.current = e.target.value
  }

  const { error, setError, loading, makePostRequest } = usePost<Customer[]>({
    url: `${serverBaseURL}/api/customer/new`,
    successCallback: async(result) => {
      setSuccess("Customer added");
      setCustomers(result);
    }
  })

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.current.trim()) {
      return setInvalid("Customer needs a name")
    }
    await makePostRequest(JSON.stringify({ name: inputValue.current }));
  }

  useEffect(() => {
    if (!open) {
      if (invalid) setInvalid("");
      if (success) setSuccess("");
      if (error) setError("");
      if (inputValue.current) {
        inputValue.current = "";
        const input = document.querySelector("input");
        if (input) input.value = "";
      };
    }
  }, [open])

  return (
    <>
      { success ?
        <div>
          <h2>{ success }</h2>
          <Button 
            title='OK'
            styleOverride={{ width: "6rem", height: "4rem" }}
            handleClick={() => setOpen(false)} />
        </div>
      :
        <form onSubmit={handleSubmit}>
          <input 
            autoCorrect="false"
            className={`${invalid ? "invalid" : "valid"} ${barrelStyles.input}`} 
            placeholder="New customer's name"
            onChange={handleChange} />
          <p className="error">{ invalid }</p>
          <Button 
            loading={loading} 
            title="Add"
            styleOverride={{ height: "4rem", width: "8rem" }} />
        { error && <p className="error">{ error }</p> }
        </form>
      }
    </>
  )
}

export default AddNew