import { useState } from 'react'
import historyStyles from '../../styles/history.module.css'
import barrelStyles from '../../styles/barrel.module.css'
import { BrlHistory } from '../../@types/barrel'
import formatDate from '../../utils/formatDate'

type Props = {
  history: BrlHistory
}

const HistoryCard = ({ history }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div id='card' className={`${historyStyles.card}`}>
      <div className={historyStyles.title} onClick={() => setOpen(!open)}>
        <h4 className={historyStyles.h}>{ history.customer } </h4>
        <span className={historyStyles.icon}>
          { history.damage_review && 
            <span className={`material-symbols-outlined`} title='Damage Reported'>report</span> 
          }
          <span className={`material-symbols-outlined ${historyStyles.arrow} ${open ? historyStyles.openArrow : historyStyles.closedArrow}`}>
              keyboard_arrow_down
          </span> 
        </span>
      </div>
      <div className={`${historyStyles.openable} ${open ? historyStyles.open : ""}`}>
        <div className={historyStyles.inner}>
          <hr className={historyStyles.hr}></hr>
          <div className={`${historyStyles.displayCurrent}`}>
            <b>Invoice: </b>
            <p>{ history.invoice }</p>
            <b>Send: </b>
            <p>{ formatDate(history.createdAt) }</p>
            <b>Returned: </b>
            <p>{ history.returned ? history.returned : "-" }</p>
            </div>
            { history.damage_review && 
              <>
                <hr className={historyStyles.hr}></hr>
                <b>Damage Report</b>
                <div className={`${historyStyles.displayCurrent} ${barrelStyles.gap1}`}>
                  <b>Date: </b>
                  <p>{ formatDate(history.damage_review.opened) }</p>
                  { history.damage_review.comments && <>
                    <b className={historyStyles.js}>Comments: </b>
                    <div>
                      <p className={historyStyles.pre}>{ history.damage_review.comments }</p> 
                    </div>
                  </>}
                  { history.damage_review.response && <>
                    <b className={historyStyles.js}>Response: </b>
                    <div>
                      <p className={historyStyles.pre}>{ history.damage_review.response }</p> 
                    </div>
                  </>}
                </div> 
              </>
            }
        </div>
      </div>
    </div>
  )
}

export default HistoryCard