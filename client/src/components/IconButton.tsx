import { CSSProperties } from "react"


type Props = {
  icon: string
  handleClick: () => void
  styleOverride?: CSSProperties
}

const IconButton = ({ icon, handleClick, styleOverride }: Props) => {
  return (
    <button onClick={handleClick} 
      style={{ display: "flex", alignItems: "center", justifyContent: "center",  height: "2rem", ...styleOverride }}>
      <span className={"material-symbols-outlined"}>
        { icon }
      </span>
    </button>
  )
}

export default IconButton