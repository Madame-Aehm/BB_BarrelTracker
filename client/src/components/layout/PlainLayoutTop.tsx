import { PropsWithChildren } from 'react'
import layoutStyles from '../../styles/layout.module.css'


const PlainLayoutTop = ({ children }: PropsWithChildren) => {
  return (
    <main className={`${layoutStyles.main}`}>
      { children }
    </main>
  )
}

export default PlainLayoutTop