import layoutStyles from '../../styles/layout.module.css'

type Props = {
  icon: string
  label: string
  handleClick: () => void
  active: boolean
}

const NavIcon = ({ icon, label, handleClick, active }: Props) => {
  return (
    <div className={`${layoutStyles.navIconWrapper} ${active ? layoutStyles.activeNavIcon : ""}`} onClick={active ? undefined : handleClick}>
      <span className={`material-symbols-outlined ${active ? "activeIconColor" : "iconColor"}`}>
        { icon }
      </span>
      <small>{ label.toUpperCase() }</small>
    </div>
  )
}

export default NavIcon