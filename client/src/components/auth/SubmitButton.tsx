import React from 'react'
import authStyles from '../../styles/auth.module.css'

type Props = {
  loading: boolean
}

const SubmitButton = ({ loading }: Props) => {
  return (
    <button 
      type={ loading ? undefined : "submit" } 
      className={`${authStyles.authSubmitButton} ${loading ? authStyles.authSubmitButtonLoading : ""}`}>
        OK
    </button>
  )
}

export default SubmitButton