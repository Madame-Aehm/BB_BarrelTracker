import { useNavigate } from "react-router-dom"

type Props = {
  customReturn?: string
}

const CancelButton = ({ customReturn }: Props) => {
  const navigate = useNavigate();
  return (
    <button 
      className='cancelButton'
      onClick={() => navigate(`${customReturn ? customReturn : "/"}`)}>
        Cancel
    </button>
  )
}

export default CancelButton