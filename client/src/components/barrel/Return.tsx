import { Dispatch } from 'react'
import { Barrel, Open } from '../../@types/barrel'
import barrelStyles from '../../styles/barrel.module.css'
import Button from '../Button'
import { useNavigate } from 'react-router-dom'
import authHeaders from '../../utils/authHeaders'
import { handleCatchError, handleNotOK } from '../../utils/handleFetchFail'
import CancelButton from './CancelButton'
import { OK } from '../../@types/auth'
import DamageReview from './DamageReview'
import formatDate from '../../utils/formatDate'
import serverBaseURL from '../../utils/baseURL'

type Props = {
  open: Open
  barrel: Barrel
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  setError: Dispatch<React.SetStateAction<string>>
}

function Return({ open, barrel, loading, setLoading, setError }: Props) {
  const navigate = useNavigate();

  const handleReturn = async() => {
    setError("");
    setLoading(true);
    const body = JSON.stringify({
      id: barrel._id,
      open: open
    })
    const headers = authHeaders();
    if (!headers) return setError("Unauthorized");
    headers.append("Content-Type", "application/json");
    try {
      const response = await fetch(`${serverBaseURL}/api/barrel/return`, { headers, body, method: "POST" });
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

  const handleDamageReviewRequest = () => {
    navigate("/report-damage", { state: { barrel } })
  }

  return (
    <>
      <div className={`${barrelStyles.displayCurrent} ${barrelStyles.width80}`}>
        <h3>Customer: </h3>
        <p>{ open.customer }</p> 
        <h3>Invoice: </h3>
        <p>{ open.invoice }</p>
        <h3>Sent: </h3> 
        <p>{ formatDate(open.createdAt) }</p>
      </div>
      { open.damage_review ? (
        <DamageReview 
          barrel={barrel} 
          loading={loading}
          setLoading={setLoading}
          setError={setError} />
      ) : (
        <div className={barrelStyles.buttonsWrapper}>
          <Button 
            loading={loading} 
            title='Mark as Returned'
            styleOverride={{ height: "5rem", width: "15rem" }}
            handleClick={handleReturn} />
          <button 
            onClick={!loading ? handleDamageReviewRequest : undefined}
            className={`${barrelStyles.damageButton} ${loading ? barrelStyles.damageButtonLoading : ""}`}>
              { loading ? "loading..." : "Request Damage Review" }
          </button>
          <CancelButton />
        </div>
      ) }
    </>
  )
}

export default Return