import { useState } from 'react'
import historyStyles from '../../styles/history.module.css'
import barrelStyles from '../../styles/barrel.module.css'
import { Barrel } from '../../@types/barrel'
import formatDate from '../../utils/formatDate'
import Button from '../Button'
import { useNavigate } from 'react-router-dom'
import IconButton from '../IconButton'
import EditBarrel from './EditBarrel'

type Props = {
  barrel: Barrel
  barrelNumbers: number[]
}

const BarrelListItem = ({ barrel, barrelNumbers }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <div className={`${historyStyles.card}`}>
      <div className={historyStyles.title} onClick={() => setOpen(!open)}>
      <h4 className={historyStyles.h}>Barrel #{ barrel.number }</h4>
      <span className={historyStyles.icon}>
          { barrel.damaged && 
            <span className={`material-symbols-outlined`} title='Retired'>do_not_disturb_on</span> 
          }
          { barrel.open?.damage_review &&
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
            <b>Currently: </b>
            { !barrel.open ? 
              <p className={historyStyles.pre}>{ barrel.damaged ? "Retired" : "Home" }</p>
            : <>
                <p className={barrelStyles.listItemText}>
                  { barrel.open.returned ? "Home" : barrel.open.customer } 
                  {" "}({ barrel.open.invoice })
                  { barrel.open.damage_review && <span className={`material-symbols-outlined`} title='Damage reported'>report</span> }
                  { barrel.open && 
                    <IconButton icon='arrow_forward' handleClick={() => navigate(`/barrel/update/${barrel.number}`)} /> }
                </p>
                <b>Since:</b>
                <p>{ formatDate(barrel.open.returned ? barrel.open.returned : barrel.open.createdAt) }</p>
              </>
            }
            <EditBarrel barrel={barrel} barrelNumbers={barrelNumbers} />
            <Button 
              title={"View Histories"}
              styleOverride={{ fontSize: "small", width: "8rem", height: "2rem", margin: "1rem 0" }}
              handleClick={() => navigate(`/barrel/history/${barrel.number}`)}
              />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarrelListItem