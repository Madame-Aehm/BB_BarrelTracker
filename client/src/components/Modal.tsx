import { PropsWithChildren } from 'react';
import modalStyles from '../styles/modal.module.css'

interface Props extends PropsWithChildren {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({ open, setOpen, children }: Props) => {
  if (open) return (
    <div className={modalStyles.outerContainer} onClick={() => setOpen(false)}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
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