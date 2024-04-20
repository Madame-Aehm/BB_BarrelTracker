import React, { useContext, useState } from 'react'
import historyStyles from "../../styles/history.module.css"
import barrelStyles from "../../styles/barrel.module.css"
import EditBarrelInput from '../barrel/EditBarrelInput'
import { BrlHistory, Damage_Review, ImgObject, ToUpdateEditBarrel } from '../../@types/barrel'
import { compressImage } from '../../utils/images'
import ImageController from '../barrel/ImageController'
import { CustomerContext } from '../../context/CustomerContext'
import { convertValueTypes, handleHistoryUpdate } from '../../utils/editBarrelTools'
import Modal from '../Modal'
import IconButton from '../IconButton'

type Props = {
  history: BrlHistory
  // files: File[]
}

const EditHistory = ({ history }: Props) => {
  const { customers } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<ImgObject[]>([]);
  const [historyUpdates, setHistoryUpdates] = useState({ ...history });
  const defaultValidation = {
    invoice: "",
    createdAt: "",
    returned: "",
    damage_report: {
      resolved: ""
    }
  }
  const [validation, setValidation] = useState(defaultValidation);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, dr?: boolean) => {
    const name = e.target.type === "radio" ? e.target.name.split("_")[0] : e.target.name;
    const value = convertValueTypes(e.target.value, name);
    setHistoryUpdates(prev => handleHistoryUpdate(prev, name, value, dr)); 
  }

  return (
    <>
      <IconButton 
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
              handleChange={handleChange}
            />
            <EditBarrelInput
              label="Since:"
              identifier={`createdAt_open${history._id}`}
              type="date"
              value={historyUpdates.createdAt?.split("T")[0]}
              validation={validation.createdAt}
              handleChange={handleChange}
            />
            <EditBarrelInput
              label="Returned:"
              identifier={`returned_open${history._id}`}
              type="date"
              value={historyUpdates.returned?.split("T")[0] || ""}
              validation={validation.returned}
              handleChange={handleChange}
            />
            { (historyUpdates.damage_review) && <>
              <h3>Damage Reported</h3>
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
                className={barrelStyles.input}
                name='response'
                onChange={(e) => handleChange(e, true)}
              />
              {/* <ImageController 
                imageArray={[...historyUpdates.damage_review.images, ...previewImages]} 
                id={`${history._id}_imgController`}
                // fileAdd={handleAddImages}
                // imageRemove={handleImageRemove}
                  /> */}
            </> }
        </div>
      </Modal> 
    </>
  )
}

export default EditHistory