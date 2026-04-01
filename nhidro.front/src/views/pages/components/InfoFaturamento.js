import React from 'react'

export default function InfoFaturamento(props) {

    const {valor, modalidadeFaturamento, color} = props

    return (
        <>
            <div style={{marginBottom: '3px'}} className="d-flex justify-content-end">
                <div>
                    <span 
                        style={{
                            width: '15px', 
                            display: 'inline-block', 
                            height: '15px', 
                            background: color
                        }}
                    ></span>
                    <span
                        style={{
                            padding: modalidadeFaturamento.lenght > 9 ? '12px' : '15px'
                        }}
                    >
                        { modalidadeFaturamento }
                    </span>
                </div>
                </div>
                <div style={{marginBottom: '3px'}} className="d-flex justify-content-end">
                <span
                    style={{
                        display: 'inline-block',
                        position: 'relative',
                        top: '-4px',
                        padding: '0px 15px 0px 0px'
                    }}
                >{ valor }</span>
            </div>  
        </>
    )
}
