import { useContext } from 'react'
import layoutStyles from '../../../styles/layout.module.css'
import NavIcon from './NavIcon'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);

  const close = () => {
    localStorage.removeItem("token");
    setAuth(false);
  }
  
  return (
    <nav className={layoutStyles.navContainer}>
      <NavIcon 
        icon='qr_code_scanner'
        label='scanner'
        handleClick={() => navigate("/")}
        active={location.pathname === "/" ? true : false} />
      {/* <NavIcon 
        icon='home' 
        label='home' 
        handleClick={() => navigate("/")} 
        active={location.pathname === "/" ? true : false} /> */}
      <NavIcon 
        icon='new_label' 
        label='labels' 
        handleClick={() => navigate("/label-gen")} 
        active={location.pathname === "/label-gen" ? true : false} />
      <NavIcon active={false} icon='logout' label='close' handleClick={close} />
    </nav>
  )
}

export default NavBar