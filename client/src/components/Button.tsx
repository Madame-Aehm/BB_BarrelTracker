import { CSSProperties } from "react"


type Props = {
  loading: boolean
  handleClick?: () => Promise<void>
  styleOverride?: CSSProperties
  title: string
}

const Button = ({ loading, handleClick, title, styleOverride }: Props) => {
  return (
    <button 
      type={ loading || handleClick ? undefined : "submit" } 
      onClick={handleClick}
      style={styleOverride ? styleOverride : {}}
      className={`${loading ? "buttonLoading" : ""}`}>
        { loading ? "loading..." : title }
    </button>
  )
}

export default Button