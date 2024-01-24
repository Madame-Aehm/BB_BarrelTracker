/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, Dispatch, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Barrel } from '../../@types/barrel'
import barrelStyles from '../../styles/barrel.module.css'
import formatDate from '../../utils/formatDate'
import Button from '../Button'
import authHeaders from '../../utils/authHeaders'
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail'
import { OK } from '../../@types/auth'
import CancelButton from './CancelButton'
import DamageImages from './DamageImages'

type Props = {
  barrel: Barrel
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  setError: Dispatch<React.SetStateAction<string>>
}

const DamageReview = ({ barrel, loading, setLoading, setError }: Props) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const navigate = useNavigate();
  const reviewResponse = useRef("");
  const damage_review = barrel.open?.damage_review;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    reviewResponse.current = e.target.value;
  }

  const handleReview = async(damaged: boolean) => {
    setError("");
    setLoading(true);
    const body = JSON.stringify({
      id: barrel._id,
      open: barrel.open,
      response: reviewResponse.current,
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
  
  if (damage_review) return (
    <>
      <div className={`${barrelStyles.atHome} ${barrelStyles.width80}`}>
          <h2 className={barrelStyles.rbm}>Damage Review Request</h2>
          <p className={barrelStyles.when}>on { formatDate(damage_review.createdAt) } </p>
          { damage_review.comments && 
            <div>
              <h3>Comments: </h3>
              <p className={barrelStyles.pre}>{ damage_review.comments }</p>
            </div> 
          }
          { damage_review.images.length > 0 ? 
            <DamageImages images={damage_review.images} /> 
          : null }
      
        <textarea 
          className={`${barrelStyles.input} ${barrelStyles.textarea}`}
          placeholder='Additional details'
          onChange={handleChange} />
      </div>
      <div className={barrelStyles.buttonsWrapper}>
        <Button 
          loading={loading}
          title='Mark as OK'
          styleOverride={{ height: "5rem", width: "15rem" }} 
          handleClick={() => handleReview(false)}
           />
        <button className={barrelStyles.damageButton} style={{ height: "5rem", width: "15rem" }} onClick={() => handleReview(true)}>
          Mark as Damaged*
        </button>
        <CancelButton />
      </div>
      <p className={barrelStyles.sideMargins}>*This means the barrel is too damaged to continue using. It will be removed from rotation.</p>
    </>
  )
}

export default DamageReview