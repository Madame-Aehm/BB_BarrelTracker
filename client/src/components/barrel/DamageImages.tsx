import { CSSProperties, useState } from 'react'
import Button from '../Button'
import Modal from '../Modal'

type Props = {
  images: [{
    public_id: string
    url: string
    _id: string
  }]
}

const DamageImages = ({ images }: Props) => {
  const [open, setOpen] = useState(false);
  return (
      <div>
        <Button 
          loading={false}
          title="See Pictures"
          styleOverride={{ fontSize: "small", width: "8rem", height: "2rem", marginBottom: "1rem" }}
          handleClick={() => setOpen(true)}
        />
        <Modal open={open} setOpen={setOpen}>
          <div style={{ width: "90%", overflow: "auto", display: "flex" }}>
            { images.map((img, i, arr) => {
              const style:CSSProperties = { height: "25rem", width: "auto", marginBottom: "1rem" }
              if (img._id !== arr[arr.length - 1]._id) style.marginRight = "1rem";
              return (
                <img 
                  key={img._id} 
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