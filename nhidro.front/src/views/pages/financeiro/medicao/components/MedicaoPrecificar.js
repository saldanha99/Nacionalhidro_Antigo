import React, { useState, useEffect } from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/pages/data-list.scss";
import { precificar, verificarPendencias } from "@src/redux/actions/financeiro/medicao/precificarActions";
import { Row, Col, FormGroup, Button, CardBody, Card } from "reactstrap";
import Select from "react-select";
import moment from "moment";
moment.locale("pt-br");
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import {
  List_StatusPrecificacao,
  Enum_StatusPrecificacao,
  Enum_StatusOrdens
} from "../../../../../utility/enum/Enums";
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import ModalNovaMedicao from "../modals/ModalNovaMedicao";
import ModalPrecificacao from "../modals/ModalPrecificacao";
import auth from "@src/services/auth";
import { connect } from "react-redux";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import { FiAlertTriangle, FiDollarSign, FiEdit } from "react-icons/fi";
import { buscarClientesAtivos } from "@src/redux/actions/administrador/cliente/listaClientesActions";
import { cadastrarMedicao, buscarPrecificacao, buscarOrdemPrecificacao, corrigirPrecificacao } from "@src/redux/actions/financeiro/medicao/index";
import { DiffDatesInDays } from "../../../../../utility/date/date";
import { matchSorter } from "match-sorter";
import { ArrowLeftCircle } from "react-feather";

const user = auth.getUserInfo();
const MySwal = withReactContent(Swal)

const MedicaoPrecificar = (props) => {
  const { selectedTipo, empresas } = props;

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 8));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 1));

  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [status, setStatus] = useState();
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ordem, setOrdem] = useState({});
  const [openPrecificar, setOpenPrecificar] = useState(false);

  const buscarOrdens = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarPrecificacao(dataInicial, dataFinal);
      setLoadingSkeleton(true);
    }
  };

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

  const visualizarPDF = (data) => {
    window.open(data.url_arquivo, "_blank");
  };

  const handleToastSuccessPrecificacao = () => {
    toast.success(
      <ToastContent
        messageTitle="Ordem de Serviço"
        messageBody="Solicitação efetuada com sucesso!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Medição"
        messageBody="Medição salva!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Medição"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const precificar = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja precificar a OS?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1"
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true
    })
      .then((result) => {
        if (result.value) {
          handleClosePrecificar()
          setLoadingSkeleton(true)
          data.DataPrecificacao = new Date()
          data.Servicos.forEach(element => {
            element.ServicosHorasAdicionais?.forEach(h => {
              h.Horas = h.Horas ? moment(h.Horas, "HH:mm").format("HH:mm:ss.SSS") : null
            })
          });
          data.StatusPrecificacao = data.StatusPrecificacao === Enum_StatusPrecificacao.EmMedicao ? Enum_StatusPrecificacao.EmMedicao : Enum_StatusPrecificacao.Precificada
          props.precificar({ data })
        }
      })
  }

  const criarMedicao = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja criar a Medição?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1"
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true
    })
      .then((result) => {
        if (result.value) {
          handleClose()
          setLoadingSkeleton(true)
          data.DataCriacao = new Date()
          data.CriadoPor = user
          props.cadastrarMedicao({ data })
        }
      })
  }

  const corrigirOrdem = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja voltar a OS para logística?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1"
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true
    })
      .then((result) => {
        if (result.value) {
          setLoadingSkeleton(true)
          const model ={
            id: data.id,
            Status: Enum_StatusOrdens.Aberta
          }
          props.corrigirPrecificacao(model)
        }
      })
  }

  useEffect(() => {
    if (selectedTipo === "Status_da_Precificação") {
      buscarOrdens(intervaloData);
      props.buscarClientesAtivos();
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    const data = props?.precificacoes;
    data.forEach(x => {
      x.foraMedicao = foraPeriodoMedicao(x)
    });
    setData(data)
    setFilteredData(data);
    setLoadingSkeleton(false);
  }, [props?.precificacoes]);

  useEffectAfterMount(() => {
    buscarOrdens(intervaloData);
  }, [intervaloData]);

  useEffectAfterMount(() => {
    handleToastSuccessPrecificacao()
    buscarOrdens(intervaloData)
  }, [props?.statePrecificar])

  useEffectAfterMount(() => {
    if (props.stateVerificacao?.data) {
      MySwal.fire('Alerta!', `As seguintes ordens da proposta estão pendentes: ${props.stateVerificacao?.data}. Favor verificar com Logística!`, 'warning')
      .then((result) => {
        if (result.value) {
          handleClosePrecificar()
        }
      })
    }
  }, [props?.stateVerificacao])

  useEffectAfterMount(() => {
    handleToastSuccess()
    buscarOrdens(intervaloData)
  }, [props?.stateSalvar])

  useEffectAfterMount(() => {
    handleToastError()
    setLoadingSkeleton(false)
  }, [props?.error])

  useEffectAfterMount(() => {
    const ordemModel = props.precificacao
    ordemModel.DataMin = intervaloData[0]
    ordemModel.DataMax = intervaloData[1]
    props.verificarPendencias(props.precificacao)
    setOpenPrecificar(true)
    setOrdem(props.precificacao)
    setLoadingSkeleton(false)
  }, [props?.precificacao])

  useEffectAfterMount(() => {
    if (data) {
      let filteredData = status === Enum_StatusPrecificacao.Todos ? data : status === Enum_StatusPrecificacao.ForaPeriodo ? data.filter(x => x.foraMedicao) : data.filter(x => status ? x.status_precificacao === status : !x.status_precificacao)
      setFilteredData(filteredData)
    }
  }, [status])

  const handleClose = () => {
    setModal(false);
  };

  const handlePrecificar = (ordem) => {
    props.buscarOrdemPrecificacao(ordem.id)
    setModal(false)
  };

  const handleClosePrecificar = () => {
    setOpenPrecificar(false);
  };

  function isWithinSemanalPeriod(diaBaseSemana, dataInicial, dataAtual) {
    if (diaBaseSemana === "" || diaBaseSemana === undefined || diaBaseSemana === null) return true;
  
    const diaSemanaInicial = dataInicial.getDay();
    const diferencaDias = ((diaSemanaInicial - diaBaseSemana + 7) % 7) - 1;
  
    const inicioPeriodo = new Date(dataInicial);
    inicioPeriodo.setDate(dataInicial.getDate() - diferencaDias);
  
    const fimPeriodo = new Date(inicioPeriodo);
    fimPeriodo.setDate(inicioPeriodo.getDate() + 6);
  
    return dataInicial >= inicioPeriodo && dataInicial <= fimPeriodo &&
    dataAtual <= fimPeriodo;
  }  

  function isWithinQuinzenalPeriod(diaBaseInicio, diaBaseFinal, dataInicial, dataAtual) { //1, 15
    if (!diaBaseInicio || !diaBaseFinal) return true;

    const diaInicial = dataInicial.getDate(); //16
    const mesInicial = dataInicial.getMonth(); //08
    const anoInicial = dataInicial.getFullYear(); //2024

    const diaBase1 = diaInicial > diaBaseFinal ? diaBaseFinal + 1 : diaBaseInicio; //16

    const inicioPeriodo = new Date(anoInicial, mesInicial, diaBase1); //2024-08-16
    var fimPeriodo = new Date(anoInicial, mesInicial, diaBase1);
    fimPeriodo.setDate(fimPeriodo.getDate() + 15); //2024-08-31

    return dataInicial >= inicioPeriodo && dataInicial <= fimPeriodo &&
    dataAtual <= fimPeriodo;
  }

  function isWithinMensalPeriod(diaBaseMensal, dataInicial, dataAtual) {
    if (!diaBaseMensal) return true;

    const mesInicial = dataInicial.getMonth();
    const anoInicial = dataInicial.getFullYear();
    
    const diaAtual = dataAtual.getDate();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();

    const inicioPeriodo = new Date(anoInicial, mesInicial - 1, diaBaseMensal + 1);
    const fimPeriodo = new Date(anoAtual, mesAtual, diaBaseMensal);

    return dataInicial >= inicioPeriodo && dataInicial <= fimPeriodo &&
           diaAtual <= diaBaseMensal;
  }

  function isWithinCadaExecucaoPeriod(dataInicial, dataAtual) {
    return dataInicial < dataAtual;
  }

  const foraPeriodoMedicao = (ordemServico) => {
    var dataAtual = new Date();
    dataAtual.setHours(0,0,0,0);

    if (ordemServico.status_precificacao === Enum_StatusPrecificacao.EmMedicao || !ordemServico.tipo_faturamento) return false;

    const dataInicial = new Date(`${ordemServico.data_inicial}T00:00:00`);
    
    switch (ordemServico.tipo_faturamento) {
        case 2: // Semanal
            return !isWithinSemanalPeriod(ordemServico.dia_base_semanal, dataInicial, dataAtual);
        
        case 3: // Quinzenal
            return !isWithinQuinzenalPeriod(ordemServico.dia_base_quinzenal_inicio, ordemServico.dia_base_quinzenal_final, dataInicial, dataAtual);
        
        case 4: // Mensal
            return !isWithinMensalPeriod(ordemServico.dia_base_mensal, dataInicial, dataAtual);
        
        case 5: // Cada Execução
            return isWithinCadaExecucaoPeriod(dataInicial, dataAtual);
        
        default:
            return false;
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col md="3">
              <div>
                <h4 className="font-weight-bolder">Filtrar Data</h4>
              </div>
              <Flatpickr
                value={intervaloData}
                onChange={(date) => handlerFiltroData(date)}
                onClose={(selectedDates, dateStr, instance) => {
                  if (selectedDates.length === 1) {
                    instance.setDate(
                      [selectedDates[0], selectedDates[0]],
                      true
                    );
                  }
                }}
                className="form-control"
                // disabled={loadingSkeleton}
                key={Portuguese}
                options={{
                  mode: "range",
                  locale: Portuguese,
                  dateFormat: "d-m-Y",
                  minDate: "10-07-2023"
                }}
                name="filtroData"
                placeholder="Intervalo de datas"
                //ref={refComp}
              />
            </Col>
            <Col md="3">
              <div>
                <h4 className="font-weight-bolder">Status</h4>
              </div>
              <FormGroup>
                <Select
                  placeholder="Selecione..."
                  className="React"
                  classNamePrefix="select"
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    control: (provided) => ({
                      ...provided,
                      minHeight: 0,
                      height: "3rem",
                    }),
                  }}
                  name="Status"
                  noOptionsMessage={() => "Sem registro!"}
                  options={List_StatusPrecificacao}
                  isClearable
                  isSearchable
                  value={List_StatusPrecificacao?.filter(
                    (option) => option.value === status
                  )}
                  onChange={(e) => {
                    setStatus(e ? e.value : Enum_StatusPrecificacao.Todos);
                  }}
                />
              </FormGroup>
            </Col>
            <Col
              md="5"
              style={{
                textAlign: "right",
                marginLeft: "auto",
                marginTop: "20px",
              }}
            >
              <Button
                color="primary"
                onClick={() => {
                  setModal(true);
                }}
                className="text-size-button"
              >
                Criar nova Medição
              </Button>
            </Col>
          </Row>
          <Col md="4">
            <div className="event-tags d-none d-sm-flex mt-1">
              <div className="tag mr-1">
                <span className="bullet bullet-danger bullet-sm mr-50"></span>
                <span>Em aberto</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-warning bullet-sm mr-50"></span>
                <span>Precificada</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-success bullet-sm mr-50"></span>
                <span>Em Medição</span>
              </div>
              <div className="tag mr-1">
                <FiAlertTriangle size={15} style={{marginRight: 2}} />
                <span>Fora do período de medição</span>
              </div>
            </div>
          </Col>
        </CardBody>
        <ReactTable loading={loadingSkeleton}
          style={{ fontSize: "small", textAlign: "center" }}
          filterable
          pagination
          responsive
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          columns={[
            {
              Header: "AÇÕES",
              accessor: "id",
              filterable: false,
              width: 160,
              Cell: (row) => {
                return (
                  <div>
                    {row.original.status_precificacao != Enum_StatusPrecificacao.EmMedicao && <ArrowLeftCircle
                      title="Corrigir"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        corrigirOrdem(row.original);
                      }}
                    />}
                    {!row.original.status_precificacao && <FiDollarSign
                      title="Precificar"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        setLoadingSkeleton(true)
                        props.buscarOrdemPrecificacao(row.original.id)
                      }}
                    />}
                    {row.original.status_precificacao && <FiEdit
                        title="Editar"
                        style={{ margin: "5px" }}
                        size={20}
                        onClick={() => {
                          setLoadingSkeleton(true)
                          props.buscarOrdemPrecificacao(row.original.id)
                        }}
                      />
                    }
                  </div>
                );
              },
            },
            {
              Header: "STATUS",
              id: "status_precificacao",
              width: 80,
              filterable: false,
              accessor: "status_precificacao",
              Cell: (row) => {
                return (<>
                  <span className={row?.original?.status_precificacao === Enum_StatusPrecificacao.EmMedicao ? "bullet bullet-success bullet-sm" : 
                  row?.original?.status_precificacao === Enum_StatusPrecificacao.Precificada ? "bullet bullet-warning bullet-sm" :
                  "bullet bullet-danger bullet-sm" }></span>
                  {row.original.foraMedicao && <FiAlertTriangle size={20} style={{ margin: '5px' }} />}
                </>
                )
              }
            },
            {
              Header: "Nº OS",
              id: "codigo",
              accessor: (value) => value.codigo + "/" + value.numero || "-",
              filterAll: true,
              width: 120,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["codigo"] }),
            },
            {
              Header: "DIAS EM ABERTO",
              id: "DiasEmAberto",
              accessor: (value) => DiffDatesInDays(moment(), value.data_baixa ? moment(value.data_baixa) : null),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["DiasEmAberto"] }),
            },
            {
              Header: "EMPRESA",
              id: "empresa",
              accessor: (value) => value.empresa || "-",
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["empresa"] }),
            },
            {
              Header: "CÓD. CLIENTE",
              id: "cliente_id",
              accessor: (value) => value.cliente_id,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["cliente_id"] }),
            },
            {
              Header: "CLIENTE",
              id: "cliente",
              accessor: (value) => value.cliente || "-",
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["cliente"] }),
            },
            {
              Header: "CONTATO",
              id: "contato",
              accessor: (value) => value.contato,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Contato"] }),
            },
            {
              Header: "DATA OS",
              id: "data_inicial",
              accessor: (value) =>
                value.data_inicial === "-" ||
                moment(value.data_inicial).local().format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_inicial"] }),
              width: 150,
              sortType: (a, b) => {
                return new Date(b.values.data_inicial) - new Date(a.values.data_inicial);
              }
            },
            {
              Header: "DATA BAIXA OS",
              id: "data_baixa",
              accessor: (value) =>
                value.data_baixa === "-" ||
                moment(value.data_baixa).local().format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_baixa"] }),
              width: 150,
              sortType: (a, b) => {
                return moment(b.values.data_baixa) - moment(a.values.data_baixa);
              }
            },
            {
              Header: "PERÍODO MEDIÇÃO",
              id: "periodo_medicao",
              accessor: (value) => value.periodo_medicao,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["periodo_medicao"] }),
            },
          ]}
          defaultPageSize={10}
          defaultSorted={[
            {
              id: "codigo",
              desc: true,
            },
          ]}
          noDataComponent="Ainda não existem"
          previousText={"Anterior"}
          nextText={"Próximo"}
          noDataText="Não há ordens para exibir"
          pageText="Página"
          ofText="de"
          rowsText="itens"
          loadingText='Carregando...'
          getTheadTrProps={(state, row) => {
            return {
              style: {
                background: "#2f4b74",
                color: "white",
                height: "2.3rem",
                fontWeight: "bold",
              },
            };
          }}
          data={filteredData}
        />
      </Card>
      <ModalNovaMedicao
        modal={modal}
        handleClose={handleClose}
        handlePrecificar={handlePrecificar}
        clientes={props.clientes}
        empresas={empresas}
        criarMedicao={criarMedicao}
      />
      <ModalPrecificacao
        open={openPrecificar}
        handleClose={handleClosePrecificar}
        ordem={ordem}
        precificar={precificar}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    precificacoes: state?.medicao?.precificacoes,
    precificacao: state?.medicao?.precificacao,
    statePrecificar: state?.medicao?.statePrecificar,
    stateVerificacao: state?.medicao?.stateVerificacao,
    stateSalvar: state?.medicao?.stateSalvar,
    error: state?.medicao?.error,
    clientes: state?.cliente?.listaClientesAtivos
  };
};

export default connect(mapStateToProps, {
  buscarPrecificacao,
  buscarOrdemPrecificacao,
  buscarClientesAtivos,
  precificar,
  verificarPendencias,
  cadastrarMedicao,
  corrigirPrecificacao
})(MedicaoPrecificar);
