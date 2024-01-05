import { useState } from 'react';
import NavBar from '../components/nav/NavBar'
import layoutStyles from '../styles/layout.module.css'
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import PrefSwitch from '../components/scanner/PrefSwitch';
import Manual from '../components/scanner/Manual';

function Scanner() {
  const navigate = useNavigate();
  const existingPref = localStorage.getItem("pref");
  const [pref, setPref] = useState(existingPref ? existingPref : "scanner");

  return (
    <main className={layoutStyles.main}>
      <NavBar />
      <PrefSwitch pref={pref} setPref={setPref} />
      { pref === "scanner" 
        ? <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (result) {
                console.log(result);
                const text = result.getText();
                navigate(`/barrel-update/${text}`, { state: "scanner" });
              }
              if (error) {
                console.log("scanning...");
              }
            }}
            scanDelay={1000}
            containerStyle={{ width: "80%", minWidth: "300px", height: "auto" }}
          /> 
        : <Manual />
      }
      
      
    </main>
  )
}

export default Scanner