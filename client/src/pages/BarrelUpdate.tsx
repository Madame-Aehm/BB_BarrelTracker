import { useParams } from 'react-router-dom'



const BarrelUpdate = () => {
  const params = useParams();
  console.log(params);
  return (
    <div>BarrelUpdate</div>
  )
}

export default BarrelUpdate