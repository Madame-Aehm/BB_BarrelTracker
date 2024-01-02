import { ChangeEvent, KeyboardEvent, MutableRefObject } from 'react'
import authStyles from '../../styles/auth.module.css'
import { Pin, PinInputType } from '../../@types/auth'
import { shiftFocus } from '../../utils/shiftFocus'

type Props = {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  id?: PinInputType
  invalid: boolean
  pin?: MutableRefObject<Pin>
}

const PinInput = ({ handleChange, id, invalid, pin }: Props) => {
  
  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (pin!.current[id!] === e.key) {
      shiftFocus(Number(id));
    }
  }

  return (
    <input 
      className={`${authStyles.pinInput} ${invalid ? authStyles.pinInvalid : ""}`} 
      id={id} 
      type="number" 
      onChange={handleChange} 
      onFocus={(e) => e.target.select()}
      onKeyUp={(pin && id) ? handleKeyUp : undefined}
      maxLength={1} />
  )
}

export default PinInput