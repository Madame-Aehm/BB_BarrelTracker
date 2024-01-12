import { PropsWithChildren } from 'react'
import layoutStyles from '../../styles/layout.module.css'
import NavBar from './nav/NavBar'


const NavLayout = ({ children }: PropsWithChildren) => {

  return (
    <main className={layoutStyles.main}>
      <NavBar />
      { children }
    </main>
  )
}

export default NavLayout