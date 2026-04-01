import Avatar from '@components/avatar'
import { Info } from "react-feather"
import { Enum_TipoFaturamento } from './enum/Enums'
import * as FileSaver from "file-saver"
import * as XLSX from "xlsx"

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

// ** Converts table to xlsx
export const exportToExcel = (table, fileName) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetcharset=UTF-8"
  const fileExtension = ".xlsx"
  const ws = XLSX.utils.json_to_sheet(table)
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] }
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const data = new Blob([excelBuffer], { type: fileType })
  FileSaver.saveAs(data, fileName + fileExtension)
}

export const ToastContent = ({ messageTitle, messageBody, color }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color={color} icon={<Info size={12} />} />
        <h6 className='toast-title font-weight-bold'>{messageTitle}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>{messageBody}</span>
    </div>
  </>
)


export const validateRequiredFields = (obj, ignoreRules = []) => {

  for (const key in obj) {

    const ignoreKey = ignoreRules.find(item => item === key)

    if (ignoreKey) {
      continue
    }

    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      return false
    }
  }

  return true
}

export const getCorEquipamento = (itemEquipamento) => {

  const tipoEquipamento = [
    {
      equipamento: 'HIDROJATO',
      cor: '#0098FE'
    },
    {
      equipamento: 'SAP',
      cor: '#FECF00'
    },
    {
      equipamento: 'CARRETA',
      cor: '#53346F'
    },
    {
      equipamento: 'CXH20',
      cor: '#60C060'
    },
    {
      equipamento: 'Vácuo',
      cor: '#80284E'
    },
    {
      equipamento: 'ROTO ROOTER',
      cor: '#E95408'
    },
    {
      equipamento: 'OUTROS',
      cor: '#ED0019'
    }
  ]

  const equipamento = tipoEquipamento.find(item => item?.equipamento === itemEquipamento)

  if (equipamento) {
    return equipamento.cor
  }

  const cor = tipoEquipamento.find(item => item.equipamento === 'OUTROS').cor

  return cor
}


export const getListEquipamentos = (row) => {

  if (row.OrdemServicoEquipamento?.length === 0) {
    return "-"
  }

  const equipamentos = row.OrdemServicoEquipamento.map(function (item) {
    return <span style={
      {
        background: getCorEquipamento(item?.Descricao),
        color: '#fff',
        padding: '5px',
        borderRadius: '25px',
        textAlign: 'center',
        display: 'inline-block'
      }
    }>{item.Descricao || "-"}</span>
  })

  return equipamentos
}

export const getTipoFaturamento = (tipo) => {
  if (tipo === Enum_TipoFaturamento.PagamentoAntecipado) {
    return "Pagamento Antecipado"
  }

  if (tipo === Enum_TipoFaturamento.CadaExecucao) {
    return "A Cada Execução"
  }

  if (tipo === Enum_TipoFaturamento.OrcamentoFechado) {
    return "Orçamento Fechado"
  }

  if (tipo === Enum_TipoFaturamento.Semanal) {
    return "Semanal"
  }

  if (tipo === Enum_TipoFaturamento.Quinzenal) {
    return "Quinzenal"
  }

  if (tipo === Enum_TipoFaturamento.Mensal) {
    return "Mensal"
  }
}

export const normalize = (data) => {
  const isObject = (data) => Object.prototype.toString.call(data) === '[object Object]'
  const isArray = (data) => Object.prototype.toString.call(data) === '[object Array]'

  const flatten = (data) => {
    if (!data.attributes) return data

    return {
      id: data.id,
      ...data.attributes
    }
  }

  if (isArray(data)) {
    return data.map((item) => normalize(item))
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data]
    } else if (isObject(data.data)) {
      data = flatten({ ...data.data })
    } else if (data.data === null) {
      data = null
    } else {
      data = flatten(data)
    }

    for (const key in data) {
      data[key] = normalize(data[key])
    }

    return data
  }

  return data
}

export const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const groupByEquipamento = (lista, coluna1) => {
  const colunas = {}
  const resultado = []

  lista.forEach(function (item) {
    const reg = {}
    colunas[item[coluna1]] = colunas[item[coluna1]] || []

    for (const i in item) reg[i] = item[i]

    colunas[item[coluna1]].push(reg)
  })

  for (const i in colunas) resultado.push({ key: colunas[i][0].Equipamento.Equipamento, values: colunas[i] })
  return resultado
}

export const gerarTextoEquipes = (equipes) => {
  let texto = ''
  equipes.forEach((equipe, index) => {
    let textoEq = `${equipe.key}: `
    equipe.values.forEach((cargo, index) => {
      if (cargo.Cargo) textoEq += `${cargo.Quantidade} ${cargo.Cargo?.Descricao ?? ''}${index === equipe.values.length - 1 ? '.' : ', '}`
    })
    texto += `${textoEq}${index === equipes.length - 1 ? '' : ' - '}`
  })
  return texto
}

export const validaCpfCnpj = (val) => {
  if (val.length === 14) {
    let cpf = val.trim()

    cpf = cpf.replace(/\./g, '')
    cpf = cpf.replace('-', '')
    cpf = cpf.split('')

    let v1 = 0
    let v2 = 0
    let aux = false

    for (let i = 1; cpf.length > i; i++) {
      if (cpf[i - 1] !== cpf[i]) {
        aux = true
      }
    }

    if (aux === false) {
      return false
    }

    for (let i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
      v1 += cpf[i] * p
    }

    v1 = ((v1 * 10) % 11)

    if (v1 === 10) {
      v1 = 0
    }

    if (v1 !== Number(cpf[9])) {
      return false
    }

    for (let i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
      v2 += cpf[i] * p
    }

    v2 = ((v2 * 10) % 11)

    if (v2 === 10) {
      v2 = 0
    }

    if (v2 !== Number(cpf[10])) {
      return false
    } else {
      return true
    }
  } else if (val.length === 18) {
    let cnpj = val.trim()

    cnpj = cnpj.replace(/\./g, '')
    cnpj = cnpj.replace('-', '')
    cnpj = cnpj.replace('/', '')
    cnpj = cnpj.split('')

    let v1 = 0
    let v2 = 0
    let aux = false

    for (let i = 1; cnpj.length > i; i++) {
      if (cnpj[i - 1] !== cnpj[i]) {
        aux = true
      }
    }

    if (aux === false) {
      return false
    }

    for (let i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
      if (p1 >= 2) {
        v1 += cnpj[i] * p1
      } else {
        v1 += cnpj[i] * p2
      }
    }

    v1 = (v1 % 11)

    if (v1 < 2) {
      v1 = 0
    } else {
      v1 = (11 - v1)
    }

    if (v1 !== Number(cnpj[12])) {
      return false
    }

    for (let i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) {
      if (p1 >= 2) {
        v2 += cnpj[i] * p1
      } else {
        v2 += cnpj[i] * p2
      }
    }

    v2 = (v2 % 11)

    if (v2 < 2) {
      v2 = 0
    } else {
      v2 = (11 - v2)
    }

    if (v2 !== Number(cnpj[13])) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}