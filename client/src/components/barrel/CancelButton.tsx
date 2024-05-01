import { CSSProperties } from "react"
import { useNavigate } from "react-router-dom"

type Props = {
  handleClick?: () => void
  styleOverride?: CSSProperties
}

const CancelButton = ({ handleClick, styleOverride }: Props) => {
  const navigate = useNavigate();
  return (
    <button 
      className='cancelButton'
      onClick={handleClick ? handleClick : () => navigate(-1)}
      style={styleOverride}>
        Cancel
    </button>
  )
}

export default CancelButton