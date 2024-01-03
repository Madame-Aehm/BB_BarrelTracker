import layoutStyles from '../styles/layout.module.css'
import homeStyles from '../styles/home.module.css'
import NavBar from "../components/nav/NavBar"


function Homepage() {
  

  return (
    <main className={layoutStyles.main}>
      <NavBar />
      <div className={homeStyles.buttonsContainer}>
        
        
      </div>
    </main>
  )
}

export default Homepage
