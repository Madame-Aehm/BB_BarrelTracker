import { useState } from 'react';
import NavBar from '../components/nav/NavBar'
import layoutStyles from '../styles/layout.module.css'
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';

function Scanner() {
  const navigate = useNavigate();
  const [found, setFound] = useState(false);
  
  console.log(QrReader)


  return (
    <main className={layoutStyles.main}>
      <NavBar />


      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(result, error) => {
          if (result) {
            console.log(result)
            const text = result.getText();
            // setFound(true);
            navigate(`/barrel-update/${text}`);
          }
          if (error) {
            console.log("scanning...");
          }
        }}
        scanDelay={1000}
        containerStyle={{ width: "80%", height: "auto" }}
      /> 
      
      
    </main>
  )
}

export default Scanner