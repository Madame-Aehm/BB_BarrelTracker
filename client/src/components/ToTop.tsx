import { useState } from 'react';
import layoutStyles from '../styles/layout.module.css'



const ToTop = () => {

  const [show, setShow] = useState(false);

  function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  }

  window.onscroll = () => scrollFunction();

  const handleScroll = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <>
      <div className={`${layoutStyles.topButtonContainer} ${show ? layoutStyles.opaque : layoutStyles.transparent}`}>
        <button 
          onClick={show ? handleScroll : undefined} 
          className={`material-symbols-outlined ${show ? layoutStyles.pointer : layoutStyles.hideCursor}`}>
          arrow_upward
        </button>
      </div>
      <div className={layoutStyles.scrollLength}></div>
    </>
      
  )
}

export default ToTop