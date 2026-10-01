import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'
import _ from 'lodash'

export const buscarUsuarios = () => {
  const query = qs.stringify(
    {
      populate: '*'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/users?${query}`, function (data) {
      if (data) {
        const users = _.orderBy(data, ['username'], ['asc'])
        dispatch({
          type: "BUSCAR_USUARIOS",
          payload: normalize(users)
        })
      } else {
        dispatch({
          type: "BUSCAR_USUARIOS_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarVendedores = (includeAdm) => {
  const query = qs.stringify({
    sort: ['username:asc'],
    populate: 'role',
    pagination: {
      pageSize: 500
    },
    _limit: 500
  }, {
    encodeValuesOnly: true // prettify URL
  })
  return (dispatch) => {
    api.get(`api/users?${query}`, function (data) {
      if (data) {
        const vendedores = _.orderBy(data.filter(x => !x.blocked && x.username !== 'SALDANHA TESTE' && (x.role?.name?.includes('Comercial') || x.role?.name?.includes('Vendedor') || x.username?.toUpperCase()?.includes('ANDREA') || x.username?.toUpperCase()?.includes('SERGIO') || x.username?.toUpperCase()?.includes('SÉRGIO') || x.aprovadorMedicao || (includeAdm && x.role?.name === 'Gerencial'))), ['username'], ['asc'])
        dispatch({
          type: "BUSCAR_VENDEDORES",
          payload: normalize(vendedores)
        })
      } else {
        dispatch({
          type: "BUSCAR_VENDEDORES_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarAprovadoresMedicao = () => {
  const query = qs.stringify({
    sort: ['username:asc'],
    populate: 'role',
    pagination: {
      pageSize: 500
    },
    _limit: 500
  }, {
    encodeValuesOnly: true // prettify URL
  })
  return (dispatch) => {
    api.get(`api/users?${query}`, function (data) {
      if (data) {
        const aprovadores = _.orderBy(data.filter(x => !x.blocked && x.username !== 'SALDANHA TESTE' && (x.aprovadorMedicao || x.role?.name?.includes('Comercial') || x.role?.name?.includes('Vendedor') || x.username?.toUpperCase()?.includes('ANDREA') || x.username?.toUpperCase()?.includes('SERGIO') || x.username?.toUpperCase()?.includes('SÉRGIO') || x.role?.name === 'Gerencial')), ['username'], ['asc'])
        dispatch({
          type: "BUSCAR_APROVADORES",
          payload: normalize(aprovadores)
        })
      } else {
        dispatch({
          type: "BUSCAR_APROVADORES_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarPermissoes = () => {
  return (dispatch) => {
    api.get(`api/users-permissions/roles`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ROLES",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ROLES_ERROR",
          payload: data
        })
      }
    })
  }
}
