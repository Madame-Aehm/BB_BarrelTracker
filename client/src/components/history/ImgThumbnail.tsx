import { ImgObject } from '../../@types/barrel'
import { historyStyles } from '../../styles/styles'

type Props = {
  img: ImgObject
  handleChange: (img: ImgObject) => void
}

const ImgThumbnail = ({ img, handleChange }: Props) => {
  return (
    <div className={historyStyles.imgThumbnailContainer}>
      <img 
        src={img.url} 
        alt="Image to illustrate reported damage" 
        style={{ height: "70px" }}
      />
      <span 
        className={`
          material-symbols-outlined 
          ${historyStyles.deleteOpen} 
          ${historyStyles.imgThumbnailIcon}`}
        onClick={() => handleChange(img)}
        >
        delete
      </span>
    </div>
  )
}

export default ImgThumbnail