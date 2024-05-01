import { PropsWithChildren } from 'react'
import { layoutStyles } from '../../styles/styles'

interface Props extends PropsWithChildren {
  top?: true
}

const PlainLayout = ({ children, top }: Props) => {
  return (
    <main className={`${layoutStyles.main} ${top ? "" : layoutStyles.trueCenter}`}>
      { children }
    </main>
  )
}

export default PlainLayout