import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'
export const buscarEmpresas = () => {
  return (dispatch) => {
    api.get(`api/empresas/getEmpresas`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_EMPRESAS",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_EMPRESAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}

export const buscarDocumentosPorEmpresa = (empresa) => {
  const query = qs.stringify(
    {
      filters: {
        Empresa: {
          id: empresa
        },
        $or: [
          {
            Deletado: {
              $null: true
            }
          },
          {
            Deletado: false
          }
        ]
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/empresa-documentos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "LISTA_EMPRESA_DOCUMENTOS",
          payload: normalize(data)
        })
      }
    })
  }
}
