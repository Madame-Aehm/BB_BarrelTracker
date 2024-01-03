import { ChangeEvent, Dispatch } from 'react'
import scannerStyles from '../../styles/scanner.module.css'

type Props = {
  pref: string
  setPref: Dispatch<React.SetStateAction<string>>
}

const PrefSwitch = ({ pref, setPref }: Props) => {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const changePref = e.target.checked ? "manual" : "scanner";
    localStorage.setItem("pref", changePref);
    setPref(changePref);
  }

  const handleClick = (changePref: string) => {
    localStorage.setItem("pref", changePref);
    setPref(changePref);
  }

  return (
    <div className={scannerStyles.switchContainer}>
      <h5 className={scannerStyles.h} onClick={() => handleClick("scanner")}>scanner</h5>
      <label className={scannerStyles.switch} htmlFor='preference'>
        <input 
          onChange={handleChange} 
          id='preference' 
          type='checkbox' 
          checked={pref === "manual" ? true : false} />
        <span className={scannerStyles.slider}></span>
      </label>
      <h5 className={scannerStyles.h} onClick={() => handleClick("manual")}>manual</h5>

    </div>
  )
}

export default PrefSwitch