import authStyles from '../../styles/auth.module.css'
import historyStyles from '../../styles/history.module.css'
import barrelStyles from '../../styles/barrel.module.css'

type Props = {
  label: string
  type?: string
  identifier: string
  value: string
  checked?: boolean
  validation?: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, open: boolean, damage_review?: boolean) => void
}

const EditBarrelInput = ({ label, type, identifier, value, checked, validation, handleChange }: Props) => {
  return (
    <>
        <label 
          htmlFor={identifier} 
          className={`
            ${historyStyles.editBarrelInputLabel}
            ${checked && historyStyles.checked} 
            ${(checked && validation) && historyStyles.invalidRadio}
            ${checked === false && historyStyles.unChecked} 
          `}>
            { label }
          </label>
        <input
          className={`${validation ? "invalid" : "valid"} ${barrelStyles.input}`}
          id={identifier}
          name={type === "radio" ? identifier : identifier.split("_")[0]}
          type={type} 
          value={value} 
          checked={checked}
          onChange={(e) => handleChange(e, identifier.includes("open") ? true : false)}
        />
        { (checked === undefined && validation) && <div><small className={authStyles.error} style={{textAlign: "right"}}>{ validation }</small></div> }
      
    </>
  )
}

export default EditBarrelInput