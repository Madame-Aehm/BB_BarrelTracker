import { CSSProperties } from "react"


type Props = {
  loading: boolean
  handleClick?: () => void
  height?: string
  width?: string
  title: string
  fontSize?: string
}

const Button = ({ loading, handleClick, height, width, fontSize, title }: Props) => {
  const style: CSSProperties = { 
    fontSize: `${fontSize ? fontSize : ""}`,
    width: `${width ? width : "fit-content"}`, 
    height: `${height ? height : "fit-content"}`
  };
  return (
    <button 
      type={ loading || handleClick ? undefined : "submit" } 
      onClick={handleClick}
      style={style}
      className={`${loading ? "buttonLoading" : ""}`}>
        { loading ? "loading..." : title }
    </button>
  )
}

export default Button