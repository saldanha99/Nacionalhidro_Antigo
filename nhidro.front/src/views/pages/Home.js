import React from "react"
import { connect } from "react-redux"

const Home = (props) => {

  const urlImageLogo = require(`@src/assets/images/logo/logo.png`).default
  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <img src={urlImageLogo} alt="homeImg" />
      <div className="mt-3">
        <span style={{fontSize: '2.2rem'}}>
          Bem vindo(a) ao <strong>Sistema da Nacional Hidro</strong><br /><br />
          Para começar, selecione uma opção no menu ao lado.
        </span>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, {
})(Home)