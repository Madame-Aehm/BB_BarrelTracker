/* eslint-disable @typescript-eslint/no-misused-promises */
import barrelStyles from '../../styles/barrel.module.css'
import { Open } from '../../@types/barrel'
import formatDate from '../../utils/formatDate'
import Button from '../Button'
import { ChangeEvent, Dispatch, useRef } from 'react'
import authHeaders from '../../utils/authHeaders'
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail'
import { OK } from '../../@types/auth'
import { useNavigate } from 'react-router-dom'

type Props = {
  id: string
  open: Open
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  setError: Dispatch<React.SetStateAction<string>>
}

const DamageReview = ({ id, open, loading, setLoading, setError }: Props) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const navigate = useNavigate();
  const reviewResponse = useRef("");
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    reviewResponse.current = e.target.value;
  }
  const handleReview = async(damaged: boolean) => {
    setError("");
    setLoading(true);
    const body = JSON.stringify({
      id: id,
      open: open,
      reviewResponse: reviewResponse.current,
      damaged
    })
    const headers = authHeaders();
    if (!headers) return setError("Unauthorized");
    headers.append("Content-Type", "application/json");
    try {
      const response = await fetch(`${serverBaseURL}/api/barrel/review-damage`, { headers, body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as OK;
        console.log(result);
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1000);
      } else {
        await handleNotOK(response, setError, setLoading);
      }
    } catch (e) {
      handleCatchError(e, setError, setLoading);
    }
  }
  
  if (open.damage_review) return (
    <div className={barrelStyles.atHome}>
      <span>
        <h2 className={barrelStyles.rbm}>Damage Review Request</h2>
        <p className={barrelStyles.when}>on { formatDate(open.damage_review.opened) } </p>
        { open.damage_review.comments && <p><b>Comments: </b>{ open.damage_review.comments }</p> }
      </span>
      <textarea 
        className={`${barrelStyles.input} ${barrelStyles.textarea}`}
        placeholder='Additional details'
        onChange={handleChange} />
      <div className={barrelStyles.buttonsWrapper}>
        <Button 
          loading={loading}
          title='Mark as OK'
          styleOverride={{ height: "4rem", width: "10rem" }} 
          handleClick={() => handleReview(false)}
           />
        <button className='cancelButton' onClick={() => handleReview(true)}>
          Mark as Damaged
        </button>
      </div>
    </div>
  )
}

export default DamageReview