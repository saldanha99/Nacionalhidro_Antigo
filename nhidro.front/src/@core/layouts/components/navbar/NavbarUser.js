// ** Dropdowns Imports
import { Fragment, useState, useEffect } from 'react'
import UserDropdown from './UserDropdown'

// ** Third Party Components
import { Sun, Moon, Menu } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'
import  { Routes }  from '../../../../router/routes/index'
import { useLocation, useHistory } from "react-router-dom"
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { ButtonBack } from '../../../../views/styled-components/GlobalStyles'
const NavbarUser = props => {

  const history = useHistory()
  const location = useLocation()
  
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  // ** Props
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', setWindowWidth(window.innerWidth))
    }
  }, [windowWidth])

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  const  goBack = () => {
    history.goBack()
  }

  const getTitleRouter = () => {
    const param = location
  
    if (!Routes) {
      return  
    }

    const route = Routes.find(route =>  route.path === param.pathname)

    if (route?.title && route?.subTitle) {
      return <>
          {
              route.isActionBack === true
              && <ButtonBack onClick={() => goBack()}>
                  <MdKeyboardArrowLeft size={30} /> 
                </ButtonBack>
          }
          <span className="font-weight-bolder">{route?.title || ''}</span> | {route?.subTitle }
        </>
    }
    
    return <>
         {
              route.isActionBack === true
              && <ButtonBack onClick={() => goBack()}>
                  <MdKeyboardArrowLeft size={30} /> 
                </ButtonBack>
          }
        <span className="font-weight-bolder">{route?.title || ''}
        </span>
      </>
  }

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center ml-3 mt-1'>
          <h3>{getTitleRouter()}</h3>
      </div>
      <ul className='nav navbar-nav align-items-center ml-auto'>
        <UserDropdown />
      </ul>
    </Fragment>
  )
}
export default NavbarUser
