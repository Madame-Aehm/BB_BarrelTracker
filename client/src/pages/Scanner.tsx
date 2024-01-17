import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import PrefSwitch from '../components/scanner/PrefSwitch';
import Manual from '../components/scanner/Manual';

type Props = {
  to: string
}

function Scanner({ to }: Props) {
  const navigate = useNavigate();
  const existingPref = localStorage.getItem("pref");
  const [pref, setPref] = useState(existingPref ? existingPref : "scanner");

  return (
    <>
      <PrefSwitch pref={pref} setPref={setPref} />
      { pref === "scanner" 
        ? <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (result) {
                console.log(result);
                const text = result.getText();
                navigate(`/barrel/${to}/${text}`, { state: "scanner" });
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
    </>
  )
}

export default Scanner