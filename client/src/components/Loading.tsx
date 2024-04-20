// import layoutStyles from '../styles/layout.module.css'
import loaderStyles from '../styles/loader.module.css'



const Loading = () => {
  return (
    <div className={loaderStyles.loader}>
      <img src='/bb_bean.png' alt='Blaue Bohne' className={loaderStyles.bbImg} />
      <h1>Loading....</h1>
    </div>
  )
}

export default Loading