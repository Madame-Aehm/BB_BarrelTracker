import { useContext, useEffect, useRef, useState } from 'react'
import IconButton from '../IconButton'
import Modal from '../Modal'
import { Barrel } from '../../@types/barrel'
import Button from '../Button'
import { convertValueTypes, validateEditBarrel } from '../../utils/editBarrelTools'
import EditBarrelInput from './EditBarrelInput'
import historyStyles from '../../styles/history.module.css'
import { CustomerContext } from '../../context/CustomerContext'

type Props = {
  barrel: Barrel
  barrelNumbers: number[]
}

export type ToUpdateEditBarrel = {
  number: number | ""
  damaged: boolean
  open: Open
}

type Open = null | {
  createdAt: string
  invoice: string
  customer: string
  returned?: string
}

const EditBarrel = ({ barrel, barrelNumbers }: Props) => {
  const { customers } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [toUpdate, setToUpdate] = useState<ToUpdateEditBarrel>({ ...barrel });

  const defaultValidation = useRef({
    number: "",
    invoice: "",
    createdAt: ""
  })
  const [validation, setValidation] = useState(defaultValidation.current);

  const handleSubmit = () => {
    setValidation(defaultValidation.current);
    const validationCheck = validateEditBarrel(toUpdate, barrelNumbers, barrel.number);
    if (validationCheck.validationFail) return setValidation(validationCheck.validationObject);
    console.log("would now submit", toUpdate);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, open: boolean) => {
    const name = e.target.type === "radio" ? e.target.name.split("_")[0] : e.target.name;
    const value = convertValueTypes(e.target.value, name);
    console.log(name, value);
    setToUpdate(prev => {
    return open && prev.open ? {
      ...prev,
      open: {
        ...prev.open,
        [name]: value
      }
    } : {
      ...prev,
      [name]: value
    }
    })
  }

  useEffect(() => {
    if (!open && (JSON.stringify(toUpdate) !== JSON.stringify(barrel))) {
      setValidation(defaultValidation.current);
      setToUpdate({ ...barrel });
    }
  }, [open])

  return (
    <>
      <IconButton 
        icon='edit' 
        handleClick={() => setOpen(true)} />
      <Modal open={open} setOpen={setOpen}>
        <div className={historyStyles.editBarrelFormContainer}>
          <h1>Edit</h1>
          <div className={historyStyles.radioContainer}>
            <EditBarrelInput 
              label="Retired"
              type="radio"
              identifier={`damaged_true${barrel._id}`}
              value="true"
              checked={toUpdate.damaged}
              handleChange={handleChange}
            />
            <EditBarrelInput
              label="Active"
              type="radio"
              identifier={`damaged_false${barrel._id}`}
              value="false"
              checked={!toUpdate.damaged}
              handleChange={handleChange}
            />
          </div>
          <EditBarrelInput
            label="Number:"
            type="number"
            identifier={`number_${barrel._id}`}
            value={toUpdate.number.toString()}
            validation={validation.number}
            handleChange={handleChange}
          />
            { !toUpdate.open ?
              <p>create invoice +</p>
              :  
              <fieldset className={historyStyles.editBarrelFormContainer}>
                <legend><h2 className={historyStyles.legend}>Open Invoice:</h2></legend>
                <span 
                  title='Delete open invoice'
                  className={`material-symbols-outlined ${historyStyles.deleteOpen}`}
                  onClick={() => setToUpdate(prev => {
                    return { ...prev, open: null }
                  })}>
                    delete
                </span>
                
                <label className={historyStyles.editBarrelInputLabel}>Customer: </label>
                <select 
                  className={historyStyles.editBarrelInput}
                  name={`customer_open_${barrel._id}`}>
                  { customers.map((c) => {
                    return (
                      <option 
                        key={`${c._id} ${barrel._id}`}
                        value={c.name}
                        selected={c.name === toUpdate.open!.customer}>
                          {c.name}
                        </option>
                    )
                  }) }
                </select>
                <EditBarrelInput 
                  label="Invoice:"
                  identifier={`invoice_open_${barrel._id}`}
                  value={toUpdate.open.invoice}
                  validation={validation.invoice}
                  handleChange={handleChange}
                />
                <EditBarrelInput
                  label="Since:"
                  identifier={`createdAt_open${barrel._id}`}
                  type="date"
                  value={toUpdate.open.createdAt?.split("T")[0]}
                  validation={validation.createdAt}
                  handleChange={handleChange}
                />
                <EditBarrelInput
                  label="Returned:"
                  identifier={`returned_open${barrel._id}`}
                  type="date"
                  value={toUpdate.open.returned?.split("T")[0] ?? ""}
                  handleChange={handleChange}
                />
              </fieldset>
            }
          <Button 
            styleOverride={{ height: "4rem", marginTop: "1rem" }}
            title={"Save Changes"} 
            handleClick={handleSubmit} 
            />
        </div>
      </Modal> 
    </>
  )
}

export default EditBarrel