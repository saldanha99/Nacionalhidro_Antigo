// ** React Imports
import { NavLink } from 'react-router-dom'


// ** Config
import themeConfig from '@configs/themeConfig'

const VerticalMenuHeader = props => {

  return (
    <div className='navbar-header d-flex justify-content-center'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item w-100'>
          <NavLink to='/' className='navbar-brand w-100'>
            <span className='brand-logo'>
              <img src={themeConfig.app.appLogoImage} alt='logo' />
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
