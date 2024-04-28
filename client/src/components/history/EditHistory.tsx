import React, { useContext, useEffect, useState } from 'react'
import { authStyles, barrelStyles, historyStyles } from '../../styles/styles'
import EditBarrelInput from '../barrel/EditBarrelInput'
import { Barrel, BrlHistory, Damage_Review } from '../../@types/barrel'
import { CustomerContext } from '../../context/CustomerContext'
import { convertValueTypes, handleHistoryUpdate, validateEditHistory } from '../../utils/editBarrelTools'
import Modal from '../Modal'
import IconButton from '../IconButton'
import Button from '../Button'
import CancelButton from '../barrel/CancelButton'
import usePost from '../../hooks/usePost'
import baseURL from '../../utils/baseURL'

type Props = {
  history: BrlHistory
  barrel: Barrel
  setBarrel: React.Dispatch<React.SetStateAction<Barrel | null>>
  // files: File[]
}

const EditHistory = ({ history, barrel, setBarrel }: Props) => {
  const { customers } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  // const [previewImages, setPreviewImages] = useState<ImgObject[]>([]);
  const [historyUpdates, setHistoryUpdates] = useState({ ...history });
  const defaultValidation = {
    invoice: "",
    createdAt: "",
    returned: "",
    closed: "",
    response: ""
  }
  const [validation, setValidation] = useState(defaultValidation);
  const [note, setNote] = useState("");

  const { loading, error, setError, makePostRequest } = usePost({
    url: `${baseURL}/api/barrel/edit-history`,
    successCallback: (result) => {
      console.log("this is callback result", result);
      if (note) {
        setBarrel(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            open: {
              ...historyUpdates
            },
            history: prev.history?.filter((his) => his._id === historyUpdates._id)
          }
        })
        return setOpen(false);
      }
      setBarrel(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          history: prev.history?.map(his => {
            if (his._id === history._id) {
              return historyUpdates
            }
            return his
          })
        }
      })
      setOpen(false);
    },
    delay: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, dr: boolean) => {
    const name = e.target.name;
    const value = convertValueTypes(e.target.value, name);
    console.log(name, value)
    if ((name === "returned" || name === "closed") && value === "") setNote(`This change will reopen the invoice for barrel ${barrel.number}`);
    if ((name === "returned" || name === "closed") && value !== "") setNote("");
    setHistoryUpdates(prev => handleHistoryUpdate(prev, name, value, dr)); 
    if (JSON.stringify(validation) !== JSON.stringify(defaultValidation)){
      setValidation(prev => {
        return {
          ...prev,
          [name]: ""
        }
      })
    }
  }

  const setEmptyDR = () => {
    if (!historyUpdates.returned) {
      return setValidation(prev => {
        return {
          ...prev,
          returned: "Damage cannot be reported if barrel has not been returned"
        }
      })
    }
    setHistoryUpdates(prev => {
      const newDR: Damage_Review = {
        createdAt: Date(),
        comments: "",
        response: "",
        images: []
    }
      return { 
        ...prev, 
        damage_review: newDR
      }
    })
    setNote(`Unless you specify a resolved date, this change will reopen the invoice for barrel ${barrel.number}`);
  }

  const handleRemoveDR = () => {
    if (validation.returned) {
      setValidation(prev => {
        return {
          ...prev,
          returned: ""
        }
      })
    }
    setHistoryUpdates(prev => { return { ...prev, damage_review: undefined } })
  }

  const generateBody = (historyUpdates: BrlHistory, files?: File[]) => {
    const body = new FormData();
    body.append("barrel_id", barrel._id);
    body.append("edits", JSON.stringify(historyUpdates));
    // files.forEach((file) => body.append("images", file));
    return body
  }

  const handleSubmit = async() => {
    const validationCheck= validateEditHistory(historyUpdates, barrel.open ? true : false);
    console.log("validation", validationCheck);
    if (validationCheck.validationFail) return setValidation(validationCheck.validationObject);
    console.log("would submit this", historyUpdates)
    await makePostRequest(generateBody(historyUpdates));
  }

  useEffect(() => {
    if (!open && (JSON.stringify(historyUpdates) !== JSON.stringify(history))) {
      setValidation(defaultValidation);
      setNote("");
      setHistoryUpdates({ ...history });
      // setPreviewImages([]);
    }
    // setError("");
  }, [open])

  return (
    <>
      <IconButton 
      styleOverride={{ margin: "0.5rem" }}
        icon='edit' 
        handleClick={() => setOpen(true)} />
      <Modal open={open} setOpen={setOpen}>
        <div className={historyStyles.editHistoryFormContainer}>
          <h1>Edit History</h1>
            {/* <span 
              title='Delete open invoice'
              className={`material-symbols-outlined ${historyStyles.deleteOpen}`}
              onClick={() => setToUpdate(prev => {
                return { ...prev, open: null }
              })}>
                delete
            </span> */}
            
            <label className={historyStyles.editBarrelInputLabel}>Customer: </label>
            <select 
              className={barrelStyles.input}
              name="customer"
              value={historyUpdates.customer}
              onChange={(e) => handleChange(e, false)}>
              { customers.map((c) => {
                return (
                  <option 
                    key={`${c._id} ${history._id}`}
                    value={c.name}>
                      {c.name}
                    </option>
                )
              }) }
            </select>
            <EditBarrelInput 
              label="Invoice:"
              identifier={`invoice_open_${history._id}`}
              value={historyUpdates.invoice}
              validation={validation.invoice}
              handleChange={(e) => handleChange(e, false)}
            />
            <EditBarrelInput
              label="Since:"
              identifier={`createdAt_open${history._id}`}
              type="date"
              value={historyUpdates.createdAt?.split("T")[0]}
              validation={validation.createdAt}
              handleChange={(e) => handleChange(e, false)}
            />
            <EditBarrelInput
              label="Returned:"
              identifier={`returned_open${history._id}`}
              type="date"
              value={historyUpdates.returned?.split("T")[0] || ""}
              validation={validation.returned}
              handleChange={(e) => handleChange(e, false)}
            />
            { !historyUpdates.damage_review && 
              <div className={historyStyles.createDamageReport}>
                <h4>Add Damage Report</h4>
                <IconButton
                  icon='add'
                  handleClick={setEmptyDR}
                />
              </div>
              
            }
            { historyUpdates.damage_review && 
            <fieldset className={historyStyles.activeInvoice}>
              <legend><h2 className={historyStyles.legend}>Damage Report:</h2></legend>
              <span 
                  title='Delete open invoice'
                  className={`material-symbols-outlined ${historyStyles.deleteOpen}`}
                  onClick={handleRemoveDR}>
                    delete
                </span>
              <label
                htmlFor={`comments_${history._id}`}
                className={`${historyStyles.editBarrelInputLabel}`}>Comments:</label>
              <textarea 
                id={`comments_${history._id}`}
                value={historyUpdates.damage_review.comments || ""} 
                placeholder='Comments can be added here' 
                className={barrelStyles.input}
                name='comments'
                onChange={(e) => handleChange(e, true)}
              />
              <label
                htmlFor={`response_${history._id}`}
                className={`${historyStyles.editBarrelInputLabel}`}>Response:</label>
              <textarea 
                id={`response_${history._id}`}
                value={historyUpdates.damage_review.response || ""} 
                placeholder='Response can be added here' 
                className={`${validation.response ? "invalid" : "valid"} ${barrelStyles.input}`}
                name='response'
                onChange={(e) => handleChange(e, true)}
              />
              { validation.response && 
                <div>
                  <small className={authStyles.error} style={{textAlign: "right"}}>{ validation.response }</small>
                </div>
              }
              <EditBarrelInput
                label="Resolved:"
                identifier={`closed_open${history._id}`}
                type="date"
                value={historyUpdates.damage_review?.closed?.split("T")[0] || ""}
                validation={validation.closed}
                handleChange={(e) => handleChange(e, true)}
              />
              {/* <ImageController 
                imageArray={[...historyUpdates.damage_review.images, ...previewImages]} 
                id={`${history._id}_imgController`}
                // fileAdd={handleAddImages}
                // imageRemove={handleImageRemove}
                  /> */}
            </fieldset> }
          {/* <p className='error'>{"error"}</p> */}
          { note && 
            <div>
              <small style={{ textAlign: "right", color: "var(--bb-blue)" }}>
                <b>Note: </b>{ note }
              </small>
            </div> 
          }
          { error && <p className='error'>{ error }</p> }
          <div className={barrelStyles.buttonsWrapper}>
            <Button 
              styleOverride={{ height: "4rem", width: "12rem" }}
              title={"Save Changes"} 
              loading={loading}
              handleClick={handleSubmit} 
            />
            <CancelButton handleClick={() => setOpen(false)} />
          </div>
        </div>
      </Modal> 
    </>
  )
}

export default EditHistory