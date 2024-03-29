import { useContext, useEffect, useRef, useState } from 'react'
import IconButton from '../IconButton'
import Modal from '../Modal'
import { Barrel, ImgObject } from '../../@types/barrel'
import Button from '../Button'
import { convertValueTypes, validateEditBarrel } from '../../utils/editBarrelTools'
import EditBarrelInput from './EditBarrelInput'
import historyStyles from '../../styles/history.module.css'
import barrelStyles from '../../styles/barrel.module.css'
import { CustomerContext } from '../../context/CustomerContext'
import CancelButton from './CancelButton'
import ImgThumbnail from '../history/ImgThumbnail'

type Props = {
  barrel: Barrel
  barrelNumbers: number[]
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

const EditBarrel = ({ barrel, barrelNumbers }: Props) => {
  const { customers } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [toUpdate, setToUpdate] = useState<ToUpdateEditBarrel>({ ...barrel });
  const imagesToDelete = useRef<string[]>([]);

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
    console.log("would now submit", toUpdate, "and also", imagesToDelete.current);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, open: boolean, damage_review?: boolean) => {
    const name = e.target.type === "radio" ? e.target.name.split("_")[0] : e.target.name;
    const value = convertValueTypes(e.target.value, name);
    console.log(name, value);
    setToUpdate(prev => {
      if (name === "returned" && !value && prev.open?.damage_review) {
        delete prev.open.damage_review;
      }
      return open && prev.open ?
        damage_review && prev.open.damage_review ? {
          ...prev,
          open: {
            ...prev.open,
            damage_review: {
              ...prev.open.damage_review,
              [name]: value
            }
          }
        } : {
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

  const handleImageRemove = (img: ImgObject) => {
    imagesToDelete.current = [...imagesToDelete.current, img.public_id];
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

  useEffect(() => {
    if (!open && (JSON.stringify(toUpdate) !== JSON.stringify(barrel))) {
      // because it doesn't compare undefined properties, need to fix returned reset if returned is empty
      imagesToDelete.current = imagesToDelete.current.filter((p_id) => {
        let fromThisBarrel = false;
        toUpdate.open?.damage_review?.images.forEach((img) => {
          if (p_id === img.public_id) fromThisBarrel = true;
        })
        return fromThisBarrel;
      })
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
                  value={toUpdate.open.returned?.split("T")[0] ?? ""}
                  handleChange={handleChange}
                />
                { toUpdate.open.damage_review && <>
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
              </fieldset>
            }
          <div className={barrelStyles.buttonsWrapper}>
            <Button 
              styleOverride={{ height: "4rem" }}
              title={"Save Changes"} 
              handleClick={handleSubmit} 
            />
            <CancelButton handleClick={() => setOpen(false)}/>
          </div>
        </div>
      </Modal> 
    </>
  )
}

export default EditBarrel