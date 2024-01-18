import { PropsWithChildren, useEffect, useState } from 'react';
import modalStyles from '../styles/modal.module.css'

interface Props extends PropsWithChildren {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({ open, setOpen, children }: Props) => {
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    if (open) setClosed(false);
    else setTimeout(() => {
        setClosed(true);
      }, 250)
  }, [open])

   return (
    <div className={`${modalStyles.outerContainer} ${open ? "" : modalStyles.fadeout} ${closed ? modalStyles.hide : ""}`} onClick={() => setOpen(false)}>
      <div className={`${modalStyles.modal} ${open ? modalStyles.enter : modalStyles.exit}`} onClick={(e) => e.stopPropagation()}>
        <div 
          className={`material-symbols-outlined ${modalStyles.close}`}
          onClick={() => setOpen(false)}>
          close
        </div>
        <div className={modalStyles.content}>
          { children }
        </div>
      </div>
    </div>
  )
}

export default Modal