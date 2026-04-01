import moment from 'moment'
import React from 'react'
moment.locale("pt-br")

const ReportEscala = (props) => {
   return (
      <html xmlns="http://www.w3.org/1999/xhtml">
         <head>
            <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,400italic,700,800" rel="stylesheet" type="text/css" />
            <link href="http://fonts.googleapis.com/css?family=Raleway:300,200,100" rel="stylesheet" type="text/css" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="./style.css" rel="stylesheet" />
         </head>
         <body cz-shortcut-listen="true">
            <div style={{padding: "12px", fontSize: "10px"}}>
               <table class="table table-bordered dataTable">
                  <tbody>
                     <tr>
                        <td colspan="5" style={{textAlign: "center"}}>
                           <h5><strong>Escala {props.escala?.Data}</strong></h5>
                        </td>
                     </tr>
                     {props.escala?.Equipamentos.map(x => <>
                        <tr>
                           <td colspan="5" style={{textAlign: "center"}}>
                              <strong></strong>
                              <h6><strong>{x.Equipamento}</strong></h6>
                           </td>
                        </tr>
                        <tr role="row">
                           <th tabindex="0" style={{width: "275px"}}>Funcionários</th>
                           <th tabindex="0" style={{width: "80px"}}>Veículos</th>
                           <th tabindex="0" style={{width: "100px"}}>Data</th>
                           <th tabindex="0" style={{width: "50px"}}>Hora</th>
                           <th tabindex="0" style={{width: "300px"}}>Cliente</th>
                           <th tabindex="0" style={{width: "275px"}}>Observação</th>
                        </tr>
                        {x.Escalas?.map(escala => escala.FuncionariosList?.length > 0 && <>
                        <tr style={{pageBreakInside: 'avoid'}} role="row">
                           <td>{escala.FuncionariosList.map(func => <><p style={{marginBottom: 0}}>{func}</p></>)}</td>
                           <td>{escala.VeiculosTexto}</td>
                           <td>{moment(escala.Data).format('DD-MM-YYYY')}</td>
                           <td>{moment(escala.Hora, "HH:mm:ss.SSS").format('HH:mm')}</td>
                           <td>{escala.ClienteTexto.map(cliente => <><p style={{marginBottom: 0}}>{cliente}</p></>)}</td>
                           <td>{escala.ObservacoesTexto.map(obs => <><p style={{marginBottom: 0}}>{obs}</p></>)}</td>
                        </tr>
                        </>)}
                     </>)}
                  </tbody>
               </table>
            </div>
            <script>
               window.print();
            </script>
         </body>
      </html>
   )
}

export default ReportEscala