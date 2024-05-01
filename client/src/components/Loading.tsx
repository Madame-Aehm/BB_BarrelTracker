import { loaderStyles } from '../styles/styles'



const Loading = () => {
  return (
    <div className={loaderStyles.loader}>
      <img src='/bb_bean.png' alt='Blaue Bohne' className={loaderStyles.bbImg} />
      <h1>Loading....</h1>
    </div>
  )
}

export default Loading