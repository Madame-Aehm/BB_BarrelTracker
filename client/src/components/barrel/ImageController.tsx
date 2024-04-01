import { ImgObject } from "../../@types/barrel"
import historyStyles from "../../styles/history.module.css"
import ImgThumbnail from "../history/ImgThumbnail"


type Props = {
  imageArray: ImgObject[]
  fileAdd: (e: React.ChangeEvent<HTMLInputElement>) => void
  imageRemove: (img: ImgObject) => void
  id: string
}

const ImageController = ({ imageArray, fileAdd, imageRemove, id }: Props) => {
  return (
    <div className={historyStyles.imgThumbnailWrap}>
      { imageArray.map((img, i) => {
        return <ImgThumbnail key={`${img.url}${i}`} img={img} handleChange={imageRemove} />
      }) }
      <label 
        className={`${historyStyles.checked} ${historyStyles.addImage}`} 
        title="Upload Pictures"
        htmlFor={id}>
        <span className="material-symbols-outlined">
          add
        </span>
      </label>
      <input 
        id={id}
        type="file" 
        accept="image/png, image/jpeg, image/jpg" 
        onChange={fileAdd}
        multiple 
        style={{ display: "none" }} />
    </div> 
  )
}

export default ImageController