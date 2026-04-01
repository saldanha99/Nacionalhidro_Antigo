// ** React Imports
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'

import auth from "@src/services/auth"
// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { Power } from 'react-feather'

import '@styles/base/pages/user-dropdown.scss'

const UserDropdown = (props) => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** State
  const [userName, setUserName] = useState(null)

  //** ComponentDidMount
  useEffect(() => {
    const userInfo = auth.getUserInfo()
    setUserName(userInfo?.username)
  }, [])

  const getInitialLettersCompleteName = (userName) => {

    if (!userName) {
      return
    }
  
    const initials = userName.substr(0, 2)
    return initials.toUpperCase()
  }
  
  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
      <div className="user-nav d-sm-flex d-none user-name ">
              <span className="user-name text-bold-600">
                {getInitialLettersCompleteName(userName)}
              </span>
            </div>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to='/login' onClick={() => dispatch(handleLogout())}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>Sair</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
