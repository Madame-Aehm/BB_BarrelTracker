/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Barrel } from '../../@types/barrel'
import barrelStyles from '../../styles/barrel.module.css'
import formatDate from '../../utils/formatDate'
import Button from '../Button'
import { OK } from '../../@types/auth'
import CancelButton from './CancelButton'
import DamageImages from './DamageImages'
import serverBaseURL from '../../utils/baseURL'
import usePost from '../../hooks/usePost'
import Loading from '../Loading'

type Props = {
  barrel: Barrel
}

const DamageReview = ({ barrel }: Props) => {
  const navigate = useNavigate();
  const reviewResponse = useRef("");
  const damage_review = barrel.open?.damage_review;
  let damaged = false;

  const { error, loading, makePostRequest } = usePost<OK>({
    url: `${serverBaseURL}/api/barrel/review-damage`,
    successCallback: (result) => {
      console.log(result);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    delay: true
  })

  const handleReview = async() => {
    const body = JSON.stringify({
      id: barrel._id,
      open: barrel.open,
      response: reviewResponse.current,
      damaged
    })
    await makePostRequest(body);
  }
  
  if (loading) return <Loading />
  if (damage_review) return (
    <>
      <div className={`${barrelStyles.atHome} ${barrelStyles.width80}`}>
          <h2 className={barrelStyles.rbm}>Damage Review Requested</h2>
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
          onChange={(e) => reviewResponse.current = e.target.value} />
      </div>
      <div className={barrelStyles.buttonsWrapper}>
        <Button 
          loading={loading}
          title='Mark as OK'
          styleOverride={{ height: "5rem", width: "15rem" }} 
          handleClick={() => {
            damaged = false;
            handleReview();
          }}
           />
        <button className={barrelStyles.damageButton} style={{ height: "5rem", width: "15rem" }} onClick={() => {
          damaged = true;
          handleReview()
          }}>
          Mark as Damaged*
        </button>
        <CancelButton />
      </div>
      { error && <p className='error'><small>{ error }</small></p> }
      <p className={barrelStyles.sideMargins}>*This means the barrel is too damaged to continue using. It will be removed from rotation.</p>
    </>
  )
}

export default DamageReview