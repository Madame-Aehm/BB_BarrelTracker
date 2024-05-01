import { PropsWithChildren } from 'react'
import { layoutStyles } from '../../styles/styles'
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