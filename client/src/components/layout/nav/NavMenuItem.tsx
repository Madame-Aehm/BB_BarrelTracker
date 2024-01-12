import { NavLink } from 'react-router-dom'

type Props = {
  to: string
  title: string
  icon: string
}

const NavMenuItem = ({ to, title, icon }: Props) => {
  return (
    <>
      <NavLink to={to} className='material-symbols-outlined' >
        { icon }
      </NavLink>
      <NavLink to={to} >
        { title }
      </NavLink>
    </>
    
  )
}

export default NavMenuItem