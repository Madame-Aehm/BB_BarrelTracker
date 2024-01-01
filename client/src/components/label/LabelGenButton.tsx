/* eslint-disable @typescript-eslint/no-misused-promises */
import { PropsWithChildren } from 'react'
import labelStyles from '../../styles/labels.module.css'

interface Props extends PropsWithChildren {
  loading: boolean
  handleClick: () => Promise<void>
}

const LabelGenButton = ({ children, loading, handleClick }: Props) => {
  return (
    <button 
      type='submit'
      className={`${labelStyles.genSubmitButton} ${loading ? labelStyles.genSubmitButtonLoading : ""}`}
      onClick={handleClick}>
      { children }
    </button>
  )
}

export default LabelGenButton