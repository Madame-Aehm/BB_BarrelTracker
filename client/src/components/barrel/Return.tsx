import { Barrel, Open } from '../../@types/barrel'
import { barrelStyles } from '../../styles/styles'
import Button from '../Button'
import { useNavigate } from 'react-router-dom'
import CancelButton from './CancelButton'
import { OK } from '../../@types/auth'
import DamageReview from './DamageReview'
import formatDate from '../../utils/formatDate'
import serverBaseURL from '../../utils/baseURL'
import usePost from '../../hooks/usePost'
import Loading from '../Loading'

type Props = {
  open: Open
  barrel: Barrel
}

function Return({ open, barrel }: Props) {
  const navigate = useNavigate();

  const { loading, error, makePostRequest } = usePost<OK>({
    url: `${serverBaseURL}/api/barrel/return`,
    successCallback: () => {
      navigate("/");
    },
    delay: true
  })

  const handleSubmit = () => {
    const body = JSON.stringify({
      id: barrel._id,
      open: open
    })
    makePostRequest(body);
  }

  const handleDamageReviewRequest = () => {
    navigate("/report-damage", { state: { barrel } })
  }
  if (loading) return <Loading />
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
      { open.damage_review ? <DamageReview barrel={barrel} /> : (
        <div className={barrelStyles.buttonsWrapper}>
          <Button 
            loading={loading} 
            title='Mark as Returned'
            styleOverride={{ height: "5rem", width: "15rem" }}
            handleClick={handleSubmit} />
          <button 
            onClick={!loading ? handleDamageReviewRequest : undefined}
            className={`${barrelStyles.damageButton} ${loading ? barrelStyles.damageButtonLoading : ""}`}>
              { loading ? "loading..." : "Request Damage Review" }
          </button>
          <CancelButton />
        </div>
      ) }
      { error && <p className='error'><small>{ error }</small></p> }
    </>
  )
}

export default Return