import { CSSProperties, useState } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import { modalStyles } from '../../styles/styles'
import { ImgObject } from '../../@types/barrel'

type Props = {
  images: ImgObject[]
}

const DamageImages = ({ images }: Props) => {
  const [open, setOpen] = useState(false);
  return (
      <div>
        <Button 
          title="See Pictures"
          styleOverride={{ fontSize: "small", width: "8rem", height: "2rem", margin: "1rem 0" }}
          handleClick={() => setOpen(true)}
        />
        <Modal open={open} setOpen={setOpen}>
          <div className={modalStyles.imagesScroller}>
            { images.map((img, i, arr) => {
              const style:CSSProperties = { height: "25rem", width: "auto", marginBottom: "1rem" }
              if (img._id !== arr[arr.length - 1]._id) style.marginRight = "1rem";
              return (
                <img 
                  key={img._id || img.url} 
                  src={img.url} 
                  alt={`Image ${i+1} of ${arr.length}`} 
                  style={style}
                />
              )
            } )}
          </div>
        </Modal>
      </div>
  )
}

export default DamageImages