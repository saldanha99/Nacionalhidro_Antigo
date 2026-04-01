// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import cliente from './administrador/cliente'
import fornecedor from './administrador/fornecedor'
import centro from './administrador/centro-custo'
import natureza from './administrador/natureza-contabil'
import empresa from './administrador/empresa'
import faturamento from './financeiro/faturamentos'
import contas from './financeiro/contas-a-pagar'
import file from './administrador/files'
import equipamento from './administrador/equipamento'
import responsabilidade from './administrador/responsabilidade'
import acessorio from './administrador/acessorio'
import usuario from './administrador/usuario'
import cargo from './administrador/cargo'
import configuracao from './administrador/configuracao'
import veiculo from './administrador/veiculo'
import funcionario from './administrador/funcionario'
import proposta from './comercial/proposta'
import historicoContato from './comercial/historico-contato'
import ordem from './logistica/ordem-servico'
import escala from './logistica/escala'
import agendamento from './logistica/agendamento'
import medicao from './financeiro/medicao'
import contaReceber from './financeiro/contas-a-receber'

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  cliente,
  fornecedor,
  centro,
  natureza,
  empresa,
  faturamento,
  contas,
  file,
  equipamento,
  responsabilidade,
  acessorio,
  usuario,
  cargo,
  configuracao,
  veiculo,
  funcionario,
  proposta,
  ordem,
  escala,
  agendamento,
  historicoContato,
  medicao,
  contaReceber
})

export default rootReducer
