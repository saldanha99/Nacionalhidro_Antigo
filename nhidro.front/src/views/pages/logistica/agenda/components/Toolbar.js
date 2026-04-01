import React from "react"
import { Button, ButtonGroup } from "reactstrap"
import { ChevronLeft, ChevronRight } from "react-feather"
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../../../../../assets/scss/plugins/calendars/react-big-calendar.scss"

class Toolbar extends React.Component {
    constructor() {
        super()
    }
    render() {
        return (
        <div className="calendar-header mb-2 d-flex justify-content-between flex-wrap">
            <div>
            </div>
            <div className="text-center view-options mt-1 mt-sm-0 ml-lg-5 ml-0">
            <ButtonGroup>
                <button
                className={`btn ${
                    this.props.view === "month" ? "btn-primary" : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                    this.props.onView("month")
                }}
                >
                Mês
                </button>
                <button
                className={`btn ${
                    this.props.view === "week" ? "btn-primary" : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                    this.props.onView("week")
                }}
                >
                Semana
                </button>
                <button
                className={`btn ${
                    this.props.view === "day" ? "btn-primary" : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                    this.props.onView("day")
                }}
                >
                Dia
                </button>
            </ButtonGroup>
            </div>
            <div className="month-label d-flex flex-column text-center text-md-right mt-1 mt-md-0">
            <div className="calendar-navigation">
                <Button.Ripple
                className="btn-icon rounded-circle"
                size="sm"
                color="primary"
                onClick={() => this.props.onNavigate("PREV")}
                >
                <ChevronLeft size={15} />
                </Button.Ripple>
                <div className="month d-inline-block mx-75 text-bold-500 font-medium-2 align-middle">
                {this.props.label}
                </div>
                <Button.Ripple
                className="btn-icon rounded-circle"
                size="sm"
                color="primary"
                onClick={() => this.props.onNavigate("NEXT")}
                >
                <ChevronRight size={15} />
                </Button.Ripple>
            </div>
            <div className="event-tags d-none d-sm-flex justify-content-end mt-1">
                <div className="tag mr-1">
                <span className="bullet bullet-success bullet-sm mr-50"></span>
                <span>Confirmado</span>
                </div>
                <div className="tag mr-1">
                <span style={{backgroundColor: '#ffb82b'}} className="bullet bullet-success bullet-sm mr-50"></span>
                <span>Agendado</span>
                </div>
                <div className="tag mr-1">
                <span className="bullet bullet-danger bullet-sm mr-50"></span>
                <span>Manutenção</span>   
                </div>
                <div className="tag mr-1">
                <span style={{backgroundColor: '#3174ad'}} className="bullet bullet-success bullet-sm mr-50"></span>
                <span>Viagem</span>
                </div>
            </div>
            </div>
        </div>
        )
    }
}

export default Toolbar