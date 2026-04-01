import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import notAuthImg from '@src/assets/images/pages/not-authorized.svg'

const urlImageLogo = require(`@src/assets/images/logo/logo-white.png`).default

import '@styles/base/pages/page-misc.scss'

const NotAuthorized = () => {
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/login'>
        <h2 className='brand-text text-primary ml-1'>Nacional Hidro</h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Você não está autorizado! 🔐</h2>
          <p className='mb-2'>
           Você não tem permissão para acessar essa página
          </p>
          <Button tag={Link} to='/login' color='primary' className='btn-sm-block mb-1'>
            Voltar para  o login
          </Button>
          <img className='img-fluid' src={notAuthImg} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default NotAuthorized
