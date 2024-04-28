import React, { useContext, useEffect, useRef, useState } from 'react'
import { authStyles, barrelStyles, historyStyles } from '../../styles/styles'
import EditBarrelInput from '../barrel/EditBarrelInput'
import { Barrel, BrlHistory, Damage_Review, ImgObject } from '../../@types/barrel'
import { CustomerContext } from '../../context/CustomerContext'
import { convertValueTypes, handleHistoryUpdate, validateEditHistory } from '../../utils/editBarrelTools'
import Modal from '../Modal'
import IconButton from '../IconButton'
import Button from '../Button'
import CancelButton from '../barrel/CancelButton'
import usePost from '../../hooks/usePost'
import baseURL from '../../utils/baseURL'
import ImageController from '../barrel/ImageController'
import { compressImage } from '../../utils/images'

type Props = {
  history: BrlHistory
  barrel: Barrel
  setBarrel: React.Dispatch<React.SetStateAction<Barrel | null>>
  previewImages: ImgObject[]
  setPreviewImages: React.Dispatch<React.SetStateAction<ImgObject[]>>
}

const EditHistory = ({ history, barrel, setBarrel, previewImages, setPreviewImages }: Props) => {
  const { customers } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const files = useRef<File[]>([]);
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

  const { loading, error, makePostRequest } = usePost<BrlHistory>({
    url: `${baseURL}/api/barrel/edit-history`,
    successCallback: (result) => {
      setPreviewImages([]);
      files.current = [];
      if (note) {
        setBarrel(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            open: {
              ...result
            },
            history: prev.history?.filter((his) => his._id === result._id)
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
              return result
            }
            return his
          })
        }
      })
      setOpen(false);
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, dr: boolean) => {
    const name = e.target.name;
    const value = convertValueTypes(e.target.value, name);
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
    setPreviewImages([]);
    files.current = [];
  }

  const handleAddImages = async(e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const toCompress = [...e.target.files].map((file) => compressImage(file));
      const compressed: File[] = [];
      (await Promise.all(toCompress)).forEach((file) => {
        compressed.push(file);
      })
      files.current = [...files.current, ...compressed];
      setPreviewImages(prev => {
        const getUrls = [];
        for (let i = 0; i < e.target.files!.length; i++) {
          getUrls.push({ url: URL.createObjectURL(e.target.files![i])} );
        }
        return [...prev, ...getUrls ];
      })
    }
  }

  const handleImageRemove = (img: ImgObject) => {
    if (!img.public_id) {
      const index = previewImages.findIndex(e => e.url === img.url);
      setPreviewImages(prev => {
        return prev.filter((_, i) => i !== index);
      })
      files.current = files.current && [...files.current].filter((_, i) => i !== index);
      return
    }
    setHistoryUpdates(prev => {
      return prev.damage_review ? {
        ...prev,
        damage_review: {
          ...prev.damage_review,
          images: prev.damage_review.images.filter((image) => image.url !== img.url)
        }
      } : prev
    })
  }

  const generateBody = (historyUpdates: BrlHistory, files: File[]) => {
    const body = new FormData();
    body.append("barrel_id", barrel._id);
    body.append("edits", JSON.stringify(historyUpdates));
    files.forEach((file) => body.append("images", file));
    return body
  }

  const handleSubmit = async() => {
    const validationCheck= validateEditHistory(historyUpdates, barrel.open ? true : false);
    if (validationCheck.validationFail) return setValidation(validationCheck.validationObject);
    await makePostRequest(generateBody(historyUpdates, files.current));
  }

  useEffect(() => {
    if (!open && (JSON.stringify(historyUpdates) !== JSON.stringify(history))) {
      setValidation(defaultValidation);
      setNote("");
      setHistoryUpdates({ ...history });
      setPreviewImages([]);
      files.current = [];
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
                  title='Delete Damage Report'
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
              <ImageController 
                imageArray={[...historyUpdates.damage_review.images, ...previewImages]} 
                id={`${history._id}_imgController`}
                fileAdd={handleAddImages}
                imageRemove={handleImageRemove}
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