import { useNavigate } from "react-router-dom"

type Props = {
  handleClick?: () => void
}

const CancelButton = ({ handleClick }: Props) => {
  const navigate = useNavigate();
  return (
    <button 
      className='cancelButton'
      onClick={handleClick ? handleClick : () => navigate(-1)}>
        Cancel
    </button>
  )
}

export default CancelButton