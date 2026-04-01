import styled from 'styled-components'

export const WrapperButtonBlue = styled.div`
    background: #2F4B74;
    height: 144px;
    color: #fff;
    border-radius: 12px;
    width: 19vh;
    margin-top: 10px;
    padding: 22px;
    cursor: pointer;
`

export const ButtonBack  = styled.button`
    background: unset !important;
    border: unset !important;
`


export const StatusFaturamentoWrapper = styled.div`
    background: #2F4B74; 
    width: 100%; 
    padding: 30px; 
`
export const ActionFaturamentoStatus =  styled.div`
    line-height: 1px;
    
    .circle {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        position: relative;
        top: -20px;
        cursor: pointer;
    }

    .description {
        color: #fff;
        display: inline-block;
        cursor: pointer;
        text-decoration: underline;
    }
`
