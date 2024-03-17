import { useState } from 'react'
import IconButton from '../IconButton'
import Modal from '../Modal'
import { Barrel } from '../../@types/barrel'
import Button from '../Button'
import authStyles from '../../styles/auth.module.css'

type Props = {
  barrel: Barrel
  barrelNumbers: number[]
}

type ToUpdate = {
  number: number | ""
  damaged: boolean
}

const EditBarrel = ({ barrel, barrelNumbers }: Props) => {
  const [open, setOpen] = useState(false);
  const [toUpdate, setToUpdate] = useState<ToUpdate>({ ...barrel });
  const defaultValidation = {
    number: ""
  }
  const [validation, setValidation] = useState(defaultValidation);

  const handleSubmit = () => {
    console.log(toUpdate);
    setValidation(defaultValidation);
    let validationFail = false;
    const validationObject = { ...defaultValidation }
    if (!toUpdate.number) {
      validationFail = true;
      validationObject.number = "Barrels need a number"
    }
    if (barrelNumbers.includes(Number(toUpdate.number)) && barrel.number !== Number(toUpdate.number)) {
      validationFail = true;
      validationObject.number = `There is already a barrel number ${toUpdate.number}`
    }
    if (validationFail) return setValidation(validationObject);
    console.log("would now submit", toUpdate);
  }
  return (
    <>
      <IconButton 
        icon='edit' 
        handleClick={() => setOpen(true)} />
      <Modal open={open} setOpen={setOpen}>
        <div>
          <h1 style={{ marginTop: "0", marginBottom: "0.5rem" }}>Edit</h1>
          <div >
            <div>
              <label htmlFor='number'>#</label>
              <input 
                className={validation.number ? "invalid" : "valid" }
                id='number'
                type='number' 
                value={toUpdate.number} 
                onChange={(e) => setToUpdate({ 
                  ...toUpdate, 
                  number: e.target.value ? Number(e.target.value) : ""
                })}
              />
            </div>
            { validation.number && <small className={authStyles.error}>{ validation.number }</small> }
            <div>
            <label htmlFor={`retiredTrue${barrel._id}`}>Retired</label>
            <input 
              type="radio" 
              name={`retired${barrel._id}`} 
              id={`retiredTrue${barrel._id}`} 
              checked={toUpdate.damaged}
              onChange={(e) => {
                setToUpdate({ ...toUpdate, damaged: true })
              }} 
              />
            <label htmlFor={`retiredFalse${barrel._id}`}>Active</label>
            <input 
              type="radio" 
              name={`retired${barrel._id}`} 
              id={`retiredFalse${barrel._id}`}
              checked={toUpdate.damaged === false}
              onChange={(e) => {
                setToUpdate({ ...toUpdate, damaged: false })
              }} 
              />
            </div>
            <Button loading={false} title={"Save Changes"} handleClick={handleSubmit} />
          </div>
        </div>
      </Modal> 
    </>
  )
}

export default EditBarrel