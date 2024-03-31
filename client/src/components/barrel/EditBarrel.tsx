import { useContext, useEffect, useRef, useState } from 'react'
import IconButton from '../IconButton'
import Modal from '../Modal'
import { Barrel, ImgObject } from '../../@types/barrel'
import Button from '../Button'
import { convertValueTypes, handleSetUpdate, validateEditBarrel } from '../../utils/editBarrelTools'
import EditBarrelInput from './EditBarrelInput'
import historyStyles from '../../styles/history.module.css'
import barrelStyles from '../../styles/barrel.module.css'
import authStyles from '../../styles/auth.module.css'
import { CustomerContext } from '../../context/CustomerContext'
import CancelButton from './CancelButton'
import ImgThumbnail from '../history/ImgThumbnail'
import baseURL from '../../utils/baseURL'
import usePost from '../../hooks/usePost'

type Props = {
  barrel: Barrel
  barrelNumbers: number[]
  setBarrels: React.Dispatch<React.SetStateAction<Barrel[] | null>>
}

export type ToUpdateEditBarrel = {
  number: number | ""
  damaged: boolean
  open: Open
}

type DamageReview = {
  comments?: string
  images: ImgObject[]
}

type Open = null | {
  createdAt: string
  invoice: string
  customer: string
  returned?: string
  damage_review?: DamageReview
}

const EditBarrel = ({ barrel, barrelNumbers, setBarrels }: Props) => {
  const { customers } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [toUpdate, setToUpdate] = useState<ToUpdateEditBarrel>({ ...barrel });

  const defaultValidation = useRef({
    number: "",
    invoice: "",
    createdAt: "",
    retired: "",
    returned: ""
  })
  const [validation, setValidation] = useState(defaultValidation.current);
  const [note, setNote] = useState("");

  const { loading, error, setError, makePostRequest } = usePost<any>({
    url: `${baseURL}/api/barrel/edit-barrel`, 
    body: JSON.stringify(toUpdate),
    successCallback: (result: Barrel) => {
      console.log("edit result", result);
      setBarrels(prev => prev ? prev.map((brl) => brl._id !== result._id ? brl : result) : null);
      setOpen(false);
    },
    delay: true
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, 
    open: boolean, 
    damage_review?: boolean) => {
    const name = e.target.type === "radio" ? e.target.name.split("_")[0] : e.target.name;
    const value = convertValueTypes(e.target.value, name);
    setToUpdate((prev) => handleSetUpdate(prev, name, value, open, damage_review));

    if (name === "returned") {
      setNote(
        !value && barrel.open?.damage_review ? "Deleting return date also deletes the damage report" 
        : value && !barrel.open?.damage_review ? "Saving this change will close invoice" : ""
      )
    }
    if (name === "damaged") {
      setNote(value && toUpdate.open?.returned ? "Saving this change will close invoice" : "");
    }
  }

  const handleImageRemove = (img: ImgObject) => {
    setToUpdate(prev => {
      return prev.open?.damage_review ? {
        ...prev,
        open: {
          ...prev.open,
          damage_review: {
            ...prev.open?.damage_review,
            images: prev.open.damage_review.images.filter((image) => image._id !== img._id)
          }
        }
      } : prev
    })
  }

  const handleSubmit = async() => {
    setValidation(defaultValidation.current);
    setError("");
    const validationCheck = validateEditBarrel(toUpdate, barrelNumbers, barrel.number);
    if (validationCheck.validationFail) return setValidation(validationCheck.validationObject);
    await makePostRequest();
  }

  useEffect(() => {
    if (!open && (JSON.stringify(toUpdate) !== JSON.stringify(barrel))) {
      setValidation(defaultValidation.current);
      setNote("");
      setToUpdate({ ...barrel });
    }
    setError("");
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
              validation={validation.retired}
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
          <div><small className={authStyles.error} style={{textAlign: "right"}}>{ validation.retired }</small></div>
          <EditBarrelInput
            label="Number:"
            type="number"
            identifier={`number_${barrel._id}`}
            value={toUpdate.number.toString()}
            validation={validation.number}
            handleChange={handleChange}
          />
            { toUpdate.open &&
              <fieldset className={historyStyles.activeInvoice}>
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
                  className={barrelStyles.input}
                  name="customer"
                  value={toUpdate.open.customer}
                  onChange={(e) => handleChange(e, true)}>
                  { customers.map((c) => {
                    return (
                      <option 
                        key={`${c._id} ${barrel._id}`}
                        value={c.name}>
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
                  value={toUpdate.open.returned?.split("T")[0] || ""}
                  validation={validation.returned}
                  handleChange={handleChange}
                />
                { (toUpdate.open.damage_review && toUpdate.open.returned) && <>
                  <h3>Damage Reported</h3>
                  <label
                    htmlFor={`comments_${barrel._id}`}
                    className={`${historyStyles.editBarrelInputLabel}`}>Comments:</label>
                  <textarea 
                    id={`comments_${barrel._id}`}
                    value={toUpdate.open.damage_review.comments || ""} 
                    placeholder='Comments can be added here' 
                    className={barrelStyles.input}
                    name='comments'
                    onChange={(e) => handleChange(e, true, true)}
                  />
                  { toUpdate.open.damage_review.images.length > 0 && 
                    <div className={historyStyles.imgThumbnailWrap}>
                      { toUpdate.open.damage_review.images.map((img, i) => {
                        return <ImgThumbnail key={`${barrel._id}img${i}`} img={img} handleChange={handleImageRemove} />
                      }) }
                    </div> 
                  }
                </> }
                { note && 
                  <div>
                    <small style={{ textAlign: "right", color: "var(--bb-blue)" }}>
                      <b>Note: </b>{ note }
                    </small>
                  </div> 
                }
              </fieldset>
            }
          <p><small className='error'>{error}</small></p>
          <div className={barrelStyles.buttonsWrapper}>
            <Button 
              styleOverride={{ height: "4rem", width: "12rem" }}
              title={"Save Changes"} 
              loading={loading}
              handleClick={handleSubmit} 
            />
            <CancelButton handleClick={() => setOpen(false)} styleOverride={ loading ? { visibility: "hidden" } : {} } />
          </div>
        </div>
      </Modal> 
    </>
  )
}

export default EditBarrel