import QRCode from 'react-qr-code'
import { labelStyles } from '../../styles/styles'

type Props = {
  id: string
  number: string
}

const LabelPlain = ({ id, number }: Props) => {
  return (
    <div className={labelStyles.plainContainer}>
      <QRCode id={id} value={id} />
      <h1 className={labelStyles.labelNumber}>- #{ number } -</h1>
    </div>
  )
}

export default LabelPlain