import { PropsWithChildren } from 'react'
import { layoutStyles } from '../../styles/styles'


const PlainLayoutTop = ({ children }: PropsWithChildren) => {
  return (
    <main className={`${layoutStyles.main}`}>
      { children }
    </main>
  )
}

export default PlainLayoutTop