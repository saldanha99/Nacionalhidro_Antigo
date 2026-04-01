import React from "react"
import { connect } from "react-redux"
import CalendarApp from "./components/Calendar"

const Agenda = (props) => {

  return (
    <div>
        <CalendarApp />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, {
})(Agenda)