import {CgFileDocument} from 'react-icons/cg'
import {HiOutlineCog, HiAdjustments, HiOutlineDocumentText, HiPhoneOutgoing} from 'react-icons/hi'
import {FiDollarSign, FiPhoneCall, FiFolderMinus, FiFolderPlus, FiShoppingBag, FiTruck, FiTool, FiSliders} from 'react-icons/fi'
import { Calendar } from 'react-feather'

export default [
  {
    id: "comercial",
    type: "collapse",
    title: "Comercial",
    icon: <FiPhoneCall size={20} />,
    children: [
      {
        id: 'proposta',
        title: 'Proposta',
        icon: <HiOutlineDocumentText />,
        navLink: '/proposta'
      }
      // {
      //   id: 'historico-contato',
      //   title: 'Histórico de Contatos',
      //   icon: <HiPhoneOutgoing />,
      //   navLink: '/historico-contato'
      // }
    ]
  },
  {
    id: "logistica",
    type: "collapse",
    title: "Logística",
    icon: <FiTruck size={20} />,
    children: [
      {
        id: 'ordemservico',
        title: 'Ordem de serviço',
        icon: <FiTool />,
        navLink: '/ordem-servico'
      },
      {
        id: 'escala',
        title: 'Escala',
        icon: <FiSliders />,
        navLink: '/escala'
      },
      {
        id: 'agenda',
        title: 'Agenda',
        icon: <Calendar />,
        navLink: '/agenda'
      }
    ]
  },
  {
    id: "financeiro",
    type: "collapse",
    title: "Financeiro",
    icon: <FiDollarSign size={20} />,
    children: [
      {
        id: 'contas',
        title: 'Contas a pagar',
        icon: <FiFolderMinus />,
        navLink: '/contas-a-pagar'
      },
       {
         id: 'medicao',
         title: 'Medição',
         icon: <HiAdjustments />,
         navLink: '/medicao'
       },
      {
        id: 'faturamento',
        title: 'Faturamento',
        icon: <FiShoppingBag />,
        navLink: '/faturamento'
      },
      {
        id: 'contas-receber',
        title: 'Contas a receber',
        icon: <FiFolderPlus />,
        navLink: '/contas-a-receber'
      }
    ]
  },
  {
    id: 'relatorios',
    title: 'Relatórios',
    icon: <CgFileDocument />,
    navLink: '/relatorios'
  },
  {
    id: 'administracao',
    title: 'Administracão',
    icon: <HiOutlineCog />,
    navLink: '/administracao'
  }
]
