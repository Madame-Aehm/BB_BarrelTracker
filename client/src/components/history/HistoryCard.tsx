import { useState } from 'react'
import { barrelStyles, historyStyles } from '../../styles/styles'
import { Barrel, BrlHistory } from '../../@types/barrel'
import formatDate from '../../utils/formatDate'
import DamageImages from '../barrel/DamageImages'
import IconButton from '../IconButton'
import { useNavigate } from 'react-router-dom'
import EditHistory from './EditHistory'

type Props = {
  history: BrlHistory
  brl: number
  setBrl: React.Dispatch<React.SetStateAction<Barrel | null>>
  brlHasOpen: boolean
}

const HistoryCard = ({ history, brl, setBrl, brlHasOpen }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`${historyStyles.card}`}>
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
            <p>{ history.returned ? formatDate(history.returned) : "-" }</p>
            </div>
            { history.damage_review ? 
              <>
                <hr className={historyStyles.hr}></hr>
                <b>Damage Report</b>
                <div className={`${historyStyles.displayCurrent}`}>
                  { history.damage_review.closed && <>
                    <b>Resolved: </b>
                    <p>{ formatDate(history.damage_review.closed) }</p>
                  </> }
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
                  <div className={barrelStyles.centerButton}>
                    <EditHistory history={history} setBrl={setBrl} brlHasOpen={brlHasOpen} />
                    { history.damage_review.closed ? <p></p> : 
                      <IconButton icon='arrow_forward' handleClick={() => navigate(`/barrel/update/${brl}`)} /> }
                  </div>
                  { history.damage_review.images.length > 0 ? 
                    <DamageImages images={history.damage_review.images} /> 
                  : null }
                </div> 
              </> : 
              <div className={historyStyles.editButtonPosition}>
                <EditHistory history={history} setBrl={setBrl} brlHasOpen={brlHasOpen} />
              </div>
            }
        </div>
      </div>
    </div>
  )
}

export default HistoryCard