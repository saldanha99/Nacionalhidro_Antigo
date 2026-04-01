// ** React Imports
import { Fragment } from "react"
import { Link } from "react-router-dom"
import { NavItem, NavLink } from "reactstrap"
import { Menu } from 'react-feather'

// ** Custom Components
import NavbarUser from "./NavbarUser"
import { useDispatch } from "react-redux"
import { handleMenuHidden } from '@store/actions/layout'

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  const logo = require(`@src/assets/images/logo/logo.png`).default
  const dispatch = useDispatch()

  const setIsHidden = val => dispatch(handleMenuHidden(val))

  const handleBtn = () => {
    setIsHidden(false)
    setMenuVisibility(true)
  }

  return (
    <Fragment>
      <ul className="navbar-nav d-flex align-items-center">
        <NavItem className='mobile-menu mr-auto'>
          <NavLink className='nav-menu-main menu-toggle hidden-xs is-active'
            onClick={handleBtn}>
            <Menu style={{color: "black"}} />
          </NavLink>
        </NavItem>
      </ul>
      <NavbarUser
        skin={skin}
        setSkin={setSkin}
        setMenuVisibility={setMenuVisibility}
      />
    </Fragment>
  )
}

export default ThemeNavbar
