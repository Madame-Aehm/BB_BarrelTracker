/* eslint-disable @typescript-eslint/no-misused-promises */
import labelStyles from '../../styles/labels.module.css'

interface Props {
  title: string
  loading: boolean
  handleClick: () => Promise<void>
}

const LabelGenButton = ({ title, loading, handleClick }: Props) => {
  return (
    <button 
      type={loading ? "submit" : undefined}
      className={`${labelStyles.genSubmitButton} ${loading ? labelStyles.genSubmitButtonLoading : ""}`}
      onClick={handleClick}>
      { loading ? "loading..." :  title }
    </button>
  )
}

export default LabelGenButton