import { PropsWithChildren } from 'react'
import layoutStyles from '../../styles/layout.module.css'


const PlainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className={`${layoutStyles.main} ${layoutStyles.trueCenter}`}>
      { children }
    </main>
  )
}

export default PlainLayout