import { LabelType } from '../../@types/labels'

type Props = {
  barrel: LabelType
}

const BarrelListItem = ({ barrel }: Props) => {
  return (
    <div>
      { barrel.number }
    </div>
  )
}

export default BarrelListItem