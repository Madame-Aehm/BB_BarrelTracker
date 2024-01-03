import { useNavigate } from "react-router-dom"
import barrelStyles from '../../styles/barrel.module.css'



const CancelButton = () => {
  const navigate = useNavigate();
  return (
    <button className={barrelStyles.cancel} onClick={() => navigate("/")}>Cancel</button>
  )
}

export default CancelButton