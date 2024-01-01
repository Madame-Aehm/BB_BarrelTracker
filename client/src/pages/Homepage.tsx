import layoutStyles from '../styles/layout.module.css'
import NavBar from "../components/nav/NavBar"


function Homepage() {
  

  return (
    <main className={layoutStyles.main}>
      <NavBar />
      
      Here is Home Component!
    </main>
  )
}

export default Homepage
