import authStyles from '../../styles/auth.module.css'

type Props = {
  loading: boolean
}

const SubmitButton = ({ loading }: Props) => {
  return (
    <button 
      type={ loading ? undefined : "submit" } 
      className={`${authStyles.authSubmitButton} ${loading ? authStyles.authSubmitButtonLoading : ""}`}>
        { loading ? "loading..." : "OK" }
    </button>
  )
}

export default SubmitButton