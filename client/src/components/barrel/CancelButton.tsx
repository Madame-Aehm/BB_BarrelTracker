import { useNavigate } from "react-router-dom"

const CancelButton = () => {
  const navigate = useNavigate();
  return (
    <button 
      className='cancelButton'
      onClick={() => navigate(-1)}>
        Cancel
    </button>
  )
}

export default CancelButton