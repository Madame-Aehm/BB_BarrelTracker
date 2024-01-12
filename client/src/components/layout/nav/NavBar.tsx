import { useContext, useEffect, useState } from 'react'
import layoutStyles from '../../../styles/layout.module.css'
import NavIcon from './NavIcon'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import NavMenuItem from './NavMenuItem'

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  window.onclick = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname])

  const close = () => {
    localStorage.removeItem("token");
    setAuth(false);
  }
  const handleClick = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e) e.stopPropagation();
    setOpen(true)
  }
  
  return (
    <>
      <nav className={layoutStyles.navContainer}>
        <NavIcon 
          icon='qr_code_scanner'
          label='scanner'
          handleClick={() => navigate("/")}
          active={location.pathname === "/" ? true : false} />
        <NavIcon 
          icon='menu' 
          label='admin' 
          handleClick={handleClick} 
          active={false} />
        <NavIcon active={false} icon='logout' label='close' handleClick={close} />
      </nav>
      <div 
        className={`${layoutStyles.sidebarContainer} ${open ? layoutStyles.sidebarOpen : layoutStyles.sidebarClosed}`}
        onClick={(e) => e.stopPropagation()}>
          <div className={layoutStyles.innerMenuWrapper}>
            <span 
              className={`material-symbols-outlined ${layoutStyles.closeMenu}`} 
              onClick={() => setOpen(false)}>
                close
            </span>
            <div className={layoutStyles.innerMenuContainer}>
              <NavMenuItem to='/label-gen' title='Labels' icon='qr_code_scanner' />
              <NavMenuItem to='' title='Barrels' icon='oil_barrel' />
              <NavMenuItem to='' title='Customers' icon='group' />
            </div>
          </div>
          <img src='bb_bean.png' style={{ width: "2rem", height: "auto", padding: "0.5rem" }}/>
      </div>
    </>
    
  )
}

export default NavBar