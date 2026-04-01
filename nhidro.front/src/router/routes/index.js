import { lazy } from 'react'
import auth from "@src/services/auth"
const userInfo = auth.getUserInfo()

// ** Document title
const TemplateTitle = 'Nacional Hidro'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/authentication/login/Login')),
    layout: 'BlankLayout',
    meta: {
      publicRoute:true,
      authRoute:true
    },
    isActionBack: false,
    subTitle:"",
    title: "Login"
  },
  {
    path: '/home',
    component: lazy(() => import('../../views/pages/Home')),
    isActionBack: false,
    subTitle:"",
    title: "Home"
  },
  {
    path: '/proposta',
    component: lazy(() => import('../../views/pages/comercial/proposta/Proposta')),
    roles:['Gerencial', 'Comercial', 'Comercial 2', 'Comercial 3', 'Faturamento'],
    isActionBack: false,
    subTitle:"",
    title: "Proposta"
  },
  {
    path: '/historico-contato',
    component: lazy(() => import('../../views/pages/comercial/historico-contato/HistoricoContato')),
    roles:['Gerencial', 'Comercial', 'Comercial 2', 'Comercial 3'],
    isActionBack: false,
    subTitle:"",
    title: "Histórico de Contatos"
  },
  {
    path: '/ordem-servico',
    component: lazy(() => import('../../views/pages/logistica/ordem-servico/OrdemServico')),
    roles:['Gerencial', 'Logistica', 'Faturamento', 'Comercial 2'],
    isActionBack: false,
    subTitle:"",
    title: "Ordem de serviço"
  },
  {
    path: '/escala',
    component: lazy(() => import('../../views/pages/logistica/escala/Escala')),
    roles:['Gerencial', 'Logistica', 'Faturamento', 'Comercial 2'],
    isActionBack: false,
    subTitle:"",
    title: "Escala"
  },
  {
    path: '/agenda',
    component: lazy(() => import('../../views/pages/logistica/agenda/Agenda')),
    roles:['Gerencial', 'Logistica', 'Comercial 3', 'Comercial 2'],
    isActionBack: false,
    subTitle:"",
    title: "Agenda"
  },
  {
    path: '/contas-a-pagar',
    component: lazy(() => import('../../views/pages/financeiro/contas-a-pagar/ContasAPagar')),
    roles:['Gerencial', 'Contas Pagar', 'Manutencao', 'Seguranca Trabalho', 'Recursos Humanos 2', 'Controle Adm', 'Compras'],
    isActionBack: false,
    subTitle:"",
    title: "Contas a pagar"
  },
  {
    path: '/medicao',
    component: lazy(() => import('../../views/pages/financeiro/medicao/Medicao')),
    roles:['Gerencial', 'Faturamento'],
    isActionBack: false,
    subTitle:"",
    title: "Medição"
  },
  {
    path: '/faturamento',
    component: lazy(() => import('../../views/pages/financeiro/faturamento/Faturamento')),
    roles:['Gerencial', 'Faturamento'],
    isActionBack: false,
    subTitle:"",
    title: "Faturamento"
  },
  {
    path: '/contas-a-receber',
    component: lazy(() => import('../../views/pages/financeiro/contas-a-receber/ContasAReceber')),
    roles:['Gerencial', 'Faturamento'],
    isActionBack: false,
    subTitle:"",
    title: "Contas a receber"
  },
  {
    path: '/relatorios',
    component: lazy(() => import('../../views/pages/relatorios/Relatorios')),
    isActionBack: false,
    subTitle:"",
    title: "Relatório"
  },
  {
    path: '/relatorio-contas-a-pagar',
    component: lazy(() => import('../../views/pages/relatorios/contas-a-pagar/RelatorioContasAPagar')),
    roles:['Gerencial', 'Contas Pagar'],
    isActionBack: true,
    subTitle:"Contas à pagar",
    title: "Relatório"
  },
  {
    path: '/relatorio-medicao',
   component: lazy(() => import('../../views/pages/relatorios/financeiro/medicao/RelatorioMedicao')),
    roles:['Gerencial', 'Faturamento'],
    isActionBack: true,
    subTitle:"Medição",
    title: "Relatório"
  },
  {
    path: '/relatorio-faturamento',
   component: lazy(() => import('../../views/pages/relatorios/financeiro/faturamento/RelatorioFaturamento')),
    roles:['Gerencial', 'Faturamento'],
    isActionBack: true,
    subTitle:"Faturamento",
    title: "Relatório"
  },
  {
    path: '/relatorio-contas-a-receber',
    component: lazy(() => import('../../views/pages/relatorios/financeiro/contas-a-receber/RelatorioContaReceber')),
    roles:['Gerencial', 'Faturamento'],
    isActionBack: true,
    subTitle:"Contas à receber",
    title: "Relatório"
  },
  {
    path: '/relatorio-gestao',
    component: lazy(() => import('../../views/pages/relatorios/gestao/RelatorioGestao')),
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"Gestão",
    title: "Relatório"
  },
  {
    path: '/relatorio-proposta',
    component: lazy(() => import('../../views/pages/relatorios/comercial/proposta/RelatorioProposta')),
    roles:['Gerencial', 'Comercial', 'Comercial 2', 'Comercial 3'],
    isActionBack: true,
    subTitle:"Proposta",
    title: "Relatório"
  },
  {
    path: '/relatorio-ordem',
    component: lazy(() => import('../../views/pages/relatorios/logistica/ordem/RelatorioOrdem')),
    roles:['Gerencial', 'Logistica', 'Recursos Humanos', 'Recursos Humanos 2', 'Faturamento', 'Controle Adm'],
    isActionBack: true,
    subTitle:"Ordem de Serviço",
    title: "Relatório"
  },
  {
    path: '/relatorio-escala',
    component: lazy(() => import('../../views/pages/relatorios/logistica/escala/RelatorioEscala')),
    roles:['Gerencial', 'Logistica', 'Recursos Humanos', 'Recursos Humanos 2', 'Faturamento', 'Controle Adm'],
    isActionBack: true,
    subTitle:"Escala",
    title: "Relatório"
  },
  {
    path: '/administracao',
    component: lazy(() => import('../../views/pages/administracao/administracao/Administracao')),
    isActionBack: false,
    subTitle:"",
    title: "Administração"
  },
  {
    path: '/administracao-clientes',
    component: lazy(() => import('../../views/pages/administracao/clientes/Clientes')),
    roles:['Gerencial', 'Comercial', 'Comercial 2', 'Comercial 3', 'Faturamento', 'Logistica', 'Integracao', 'Seguranca Trabalho'],
    isActionBack: true,
    subTitle:"Clientes",
    title: "Administração"
  },
  {
    path: '/administracao-fornecedores',
    component: lazy(() => import('../../views/pages/administracao/fornecedor/Fornecedor')),
    roles:['Gerencial', 'Comercial', 'Contas Pagar', 'Manutencao', 'Recursos Humanos 2', 'Controle Adm', 'Compras'],
    isActionBack: true,
    subTitle:"Fornecedores",
    title: "Administração"
  },
  {
    path: '/administracao-empresas',
    component: lazy(() => import('../../views/pages/administracao/empresas/Empresas')),
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"Empresas",
    title: "Administração"
  },
  {
    path: '/administracao-centro-custo',
    component: lazy(() => import('../../views/pages/administracao/centro-custo/CentroCusto')),
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"Centro Custo",
    title: "Administração"
  },
  {
    path: '/administracao-naturezas',
    component: lazy(() => import('../../views/pages/administracao/naturezas/Naturezas')),
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"Naturezas",
    title: "Administração"
  },
  {
    path: '/administracao-equipamentos',
    component: lazy(() => import('../../views/pages/administracao/equipamentos/Equipamentos')),
    roles:['Gerencial', 'Comercial', 'Comercial 2', 'Comercial 3', 'Logistica'],
    isActionBack: true,
    subTitle:"Equipamentos",
    title: "Administração"
  },
  {
    path: '/administracao-responsabilidades',
    component: lazy(() => import('../../views/pages/administracao/responsabilidades/Responsabilidades')),
    roles:['Gerencial', 'Comercial', 'Comercial 2', 'Comercial 3'],
    isActionBack: true,
    subTitle:"Responsabilidades",
    title: "Administração"
  },
  {
    path: '/administracao-acessorios',
    component: lazy(() => import('../../views/pages/administracao/acessorios/Acessorios')),
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"Acessórios",
    title: "Administração"
  },
  {
    path: '/administracao-usuarios',
    component: lazy(() => import('../../views/pages/administracao/usuario/Usuarios')),
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"Usuários",
    title: "Administração"
  },
  {
    path: '/administracao-cargos',
    component: lazy(() => import('../../views/pages/administracao/cargos/Cargos')),
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"Cargos",
    title: "Administração"
  },
  {
    path: '/administracao-veiculos',
    component: lazy(() => import('../../views/pages/administracao/veiculos/Veiculos')),
    roles:['Gerencial', 'Comercial', 'Comercial 2', 'Comercial 3', 'Logistica'],
    isActionBack: true,
    subTitle:"Veículos",
    title: "Administração"
  },
  {
    path: '/administracao-funcionarios',
    component: lazy(() => import('../../views/pages/administracao/funcionarios/Funcionarios')),
    roles:['Gerencial', 'Recursos Humanos'],
    isActionBack: true,
    subTitle:"Funcionários",
    title: "Administração"
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout',
    roles:['Gerencial'],
    isActionBack: true,
    subTitle:"",
    title: "error"
  },
  {
    path: '/not-authorized',
    component: lazy(() => import('../../views/NotAuthorized')),
    layout: 'BlankLayout',
    isActionBack: true,
    meta: {
      publicRoute:true
    },
    subTitle:"",
    title: "error"
  }
]

export { DefaultRoute, TemplateTitle, Routes }
