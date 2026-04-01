import React, { useState, useEffect } from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/pages/data-list.scss";
import { Row, Col, FormGroup, CardBody, Card, Spinner } from "reactstrap";
import Select from "react-select";
import moment from "moment";
moment.locale("pt-br");
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import 'react-quill/dist/quill.snow.css'
import {
  List_StatusMedicao,
  Enum_StatusMedicao,
  Enum_StatusPrecificacao,
} from "../../../../../utility/enum/Enums";
import { ToastContent } from "@utils";
import { toast, Slide } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { buscarMedicoesRaw, buscarMedicao, imprimirMedicao, enviarMedicao, cancelarMedicao, alterarMedicao, alterarStatusMedicao, reprovarMedicao, aprovarMedicao } from "@src/redux/actions/financeiro/medicao/index";
import { buscarOrdensMedicao } from "../../../../../redux/actions/logistica/ordem-servico/buscarOrdensActions";
import { connect } from "react-redux";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import { formatImage } from '../../../../../utility/file/index'
import uuidv4 from 'uuid/v4'
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import {
  FiEye,
  FiSend,
  FiEdit,
  FiList,
  FiXCircle,
  FiThumbsDown,
  FiThumbsUp,
} from "react-icons/fi";
import { buscarClientesAtivos } from "@src/redux/actions/administrador/cliente/listaClientesActions";
import { buscarAprovadoresMedicao } from "@src/redux/actions/administrador/usuario/buscarUsuariosActions"
import { precificar } from "@src/redux/actions/financeiro/medicao/precificarActions";
import ModalEdicaoMedicao from "../modals/ModalEdicaoMedicao";
import ModalAprovarCobrancaMedicao from "../modals/ModalAprovarCobrancaMedicao";
import ModalPrecificacao from "../modals/ModalPrecificacao";
import { DiffDatesInDays } from "../../../../../utility/date/date";
import { matchSorter } from "match-sorter";

const MySwal = withReactContent(Swal);

const MedicaoStatusMedicao = (props) => {
  const { selectedTipo } = props;
  const diasParaVencimento = 2

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [status, setStatus] = useState();
  const [modalEdicao, setModalEdicao] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [medicao, setMedicao] = useState({});
  const [modalAprovar, setModalAprovar] = useState(false);
  const [openPrecificar, setOpenPrecificar] = useState(false);
  const [ordem, setOrdem] = useState({});
  const [dataPrint, setDataPrint] = useState({})

  const buscarMedicoes = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarMedicoesRaw(dataInicial, dataFinal);
      setLoadingSkeleton(true);
    }
  };

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Medição"
        messageBody="Medição salva!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    );
  };

  const handleToastSuccessPrecificacao = () => {
    toast.success(
      <ToastContent
        messageTitle="Ordem de Serviço"
        messageBody="Precificação salva!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastSuccessEnvioMedicao = () => {
    toast.success(
      <ToastContent
        messageTitle="Medição"
        messageBody="Medição enviada!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    const message = props.error?.data?.error?.message
      || props.error?.error?.message
      || props.error?.message
      || 'Falha ao processar operação!'
    toast.error(
      <ToastContent
        messageTitle="Medição"
        messageBody={message}
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    );
  };

  const cancelar = (data) => {
    MySwal.fire({
      title: "Aviso",
      icon: "warning",
      text: "Tem certeza que deseja cancelar?",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1",
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true,
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          text: "Motivo do cancelamento:",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Salvar",
          cancelButtonText: "Cancelar",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-primary mr-1",
          },
          reverseButtons: true,
          preConfirm: (value) => {
            if (value) {
              const model = {
                id: data.id,
                MotivoCancelamento: value,
                DataCancelamento: new Date(),
                Status: Enum_StatusMedicao.Cancelado
              }
              setLoadingSkeleton(true);
              props.cancelarMedicao({data: model});
            } else {
              Swal.showValidationMessage("O motivo é um campo obrigatório");
            }
          },
          buttonsStyling: false,
          showLoaderOnConfirm: true,
        });
      }
    });
  };

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
          setLoadingSkeleton(true);
          data.DataPrecificacao = new Date()
          data.StatusPrecificacao = data.StatusPrecificacao === Enum_StatusPrecificacao.EmMedicao ? Enum_StatusPrecificacao.EmMedicao : Enum_StatusPrecificacao.Precificada
          props.precificar({ data })
        }
      })
  }

  const reprovarCobrança = (data) => {
    MySwal.fire({
      title: `Medição ${data.codigo} | Revisão ${data.revisao}`,
      text: "Tem certeza que deseja reprovar a cobrança?\n\tSerá criada uma nova revisão da medição.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1",
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        setLoadingSkeleton(true);
        const model = {
          id: data.id,
          Status: Enum_StatusMedicao.Reprovada,
          DataAprovacao: new Date()
        }

        props.reprovarMedicao({ data: model });
      }
    });
  };

  const aprovar = (medicao, textImagem) => {
    MySwal.fire({
      title: `Medição ${medicao.codigo} | Revisão ${medicao.revisao}`,
      text: "Tem certeza que deseja aprovar a cobrança?\n\O valor aprovado será enviado para faturamento.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1",
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        setLoadingSkeleton(true);
        handleCloseAprovarCobranca()
        const data = {
          Medicao: {
            id: medicao.id,
            Cte: medicao.cte,
            ValorAprovado: medicao.valor_aprovado,
            ValorServicoFatura: medicao.ValorServicoFatura,
            ValorRLFatura: medicao.ValorRLFatura,
            SaldoDevedor: medicao.SaldoDevedor
          },
          Cliente: medicao.cliente_id,
          Empresa: medicao.empresa_id,
          Imagem: {}
        }
        data.Medicao.ValorAprovado += medicao.SaldoDevedor
        data.Medicao.Status = data.Medicao.ValorAprovado >= medicao.valor_total ? Enum_StatusMedicao.Aprovada : Enum_StatusMedicao.AprovadaParcialmente;

        if(data.Medicao.Status === Enum_StatusMedicao.Aprovada) data.Medicao.DataAprovacao = new Date()
        
        const image = formatImage(textImagem)
        const extension = image.type.split('/')[1]
        const filename = `${uuidv4()}.${extension}`

        data.Imagem.Buffer = Buffer.from(image.buffer)
        data.Imagem.FileName = filename
        data.Imagem.Type = image.type

        props.aprovarMedicao({ data });
      }
    });
  };

  const send = (data) => {
    MySwal.fire({
      title: `Medição ${data.codigo} | Revisão ${data.revisao}`,
      text: "Tem certeza que deseja ENVIAR a cobrança para o cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1",
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        setLoadingSkeleton(true);
        props.enviarMedicao({ data });
      }
    });
  };

  const alterarMedicao = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: data.Status === Enum_StatusMedicao.Conferencia ? "Tem certeza que deseja enviar para validação?" : "Tem certeza que deseja salvar a Medição?",
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
          props.alterarMedicao({ data })
        }
      })
  }

  const alterarStatusMedicao = (data, corrigir = false) => {
    MySwal.fire({
      title: "Aviso",
      text: corrigir ? "Tem certeza que deseja solicitar a correção? A Medição voltará para o status 'Em Aberto'." : data.Status === Enum_StatusMedicao.Validada ? "Tem certeza que deseja aprovar a Medição?" : "Tem certeza que deseja salvar a Medição?",
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
          props.alterarStatusMedicao({ data })
        }
      })
  }
    
  useEffect(() => {
    if (selectedTipo === "Status_da_Medição") {
      buscarMedicoes(intervaloData);
      props.buscarClientesAtivos();
      props.buscarAprovadoresMedicao();
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setFilteredData(props?.medicoes);
    setLoadingSkeleton(false);
  }, [props?.medicoes]);

  useEffectAfterMount(() => {
    buscarMedicoes(intervaloData);
  }, [intervaloData]);

  useEffectAfterMount(() => {
    handleToastSuccess();
    buscarMedicoes(intervaloData);
  }, [props?.stateSalvar]);

  useEffectAfterMount(() => {
    handleToastSuccessPrecificacao();
    buscarMedicoes(intervaloData);
  }, [props?.statePrecificar])

  useEffectAfterMount(() => {
    setLoadingSkeleton(false);
    buscarMedicoes(intervaloData);
  }, [props?.stateCancelar]);

  useEffectAfterMount(() => {
    handleToastError();
    setLoadingSkeleton(false)
  }, [props?.error]);

  useEffectAfterMount(() => {
    handleToastSuccessEnvioMedicao()
    buscarMedicoes(intervaloData)
  }, [props?.send])

  useEffectAfterMount(() => {
    if (!props.print?.data) return
    const blob = new Blob([new Uint8Array(props?.print?.data)], { type: 'application/pdf' })
    var fileURL = window.URL.createObjectURL(blob)
    let tab = window.open()
    tab.location.href = fileURL
    setDataPrint({})
  }, [props?.print])

  useEffectAfterMount(() => {
    if (props.medicoes) {
      let filteredData =
        status === Enum_StatusMedicao.Todos
          ? props.medicoes
          : status === Enum_StatusMedicao.Atrasado
          ? props.medicoes.filter((x) => DiffDatesInDays(moment(), moment(x.data_cobranca)) > diasParaVencimento)
          : props.medicoes.filter((x) => x.status === status);
      setFilteredData(filteredData);
    }
  }, [status]);

  useEffectAfterMount(() => {
    if (!props.medicao) return
    props.buscarOrdensMedicao({Cliente: {id: props.medicao.Cliente?.id}});
    setModalEdicao(true);
    setMedicao(props.medicao)
    setLoadingSkeleton(false)
  }, [props?.medicao])

  const handleClose = () => {
    setModalEdicao(false);
  };

  const handleCloseAprovarCobranca = () => {
    setModalAprovar(false);
  };

  const handlePrecificar = (ordem) => {
    setOrdem(ordem);
    handleClose()
    setOpenPrecificar(true)
  };

  const handleClosePrecificar = () => {
    setOpenPrecificar(false);
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
                  options={List_StatusMedicao}
                  isClearable
                  isSearchable
                  value={List_StatusMedicao?.filter(
                    (option) => option.value === status
                  )}
                  onChange={(e) => {
                    setStatus(e ? e.value : Enum_StatusMedicao.Todos);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Col md="8">
            <div className="event-tags d-none d-sm-flex mt-1">
              <div className="tag mr-1">
                <span className="bullet bullet-warning bullet-sm mr-50"></span>
                <span>Em aberto</span>
              </div>
              <div className="tag mr-1">
                <span
                  style={{ backgroundColor: "#D66BFC" }}
                  className="bullet bullet-success bullet-sm mr-50"
                ></span>
                <span>Em conferência</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-success bullet-sm mr-50"></span>
                <span>Validado</span>
              </div>
              <div className="tag mr-1">
                <span
                  className="bullet bullet-primary bullet-sm mr-50"
                ></span>
                <span>Aguardando aprovação do cliente</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-secondary bullet-sm mr-50"></span>
                <span>Aprovado parcialmente</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-danger bullet-sm mr-50"></span>
                <span>Atrasado</span>
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
                    {row.original?.status !== Enum_StatusMedicao.AprovadaParcialmente && <FiXCircle
                      title="Cancelar"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        cancelar(row.original);
                      }}
                    />}
                    {row.original.id === dataPrint.id ? <Spinner size={20} /> : <FiEye
                      title="Visualizar PDF"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        setDataPrint(row.original)
                        props.imprimirMedicao(row.original);
                      }}
                    />}
                    {(row.original?.status === Enum_StatusMedicao.EmAberto || row.original?.status === Enum_StatusMedicao.Conferencia) && <FiEdit
                      title="Editar"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        setLoadingSkeleton(true)
                        props.buscarMedicao(row.original.id)
                      }}
                    />}
                    {row?.original?.status === Enum_StatusMedicao?.Validada && (
                      <>
                        <FiEdit
                          title="Exibir"
                          style={{ margin: "5px" }}
                          size={20}
                          onClick={() => {
                            setLoadingSkeleton(true)
                            props.buscarMedicao(row.original.id)
                          }}
                        />
                        <FiSend
                          title="Enviar"
                          style={{ margin: "5px" }}
                          size={20}
                          onClick={() => {
                            send(row.original);
                          }}
                        />
                      </>
                    )}
                    {row.original?.status > Enum_StatusMedicao.Validada && (
                        <>
                          <FiThumbsDown
                            title="Reprovar"
                            style={{ margin: "5px" }}
                            size={20}
                            onClick={() => {
                              reprovarCobrança(row.original);
                            }}
                          />
                          <FiThumbsUp
                            title="Avaliar"
                            style={{ margin: "5px" }}
                            size={20}
                            onClick={() => {
                              setMedicao(row.original);
                              setModalAprovar(true);
                            }}
                          />
                        </>
                    )}
                  </div>
                );
              },
            },
            {
              Header: "STATUS",
              id: "status",
              width: 80,
              filterable: false,
              accessor: "status",
              Cell: (row) => {
                return (
                  <span style={row.original?.status === Enum_StatusMedicao.Conferencia ? {backgroundColor: "#D66BFC" } : {}}
                    className={
                      row.original.data_cobranca && DiffDatesInDays(moment(), row.original.data_cobranca ? moment(row.original.data_cobranca) : null) > diasParaVencimento
                      ? "bullet bullet-danger bullet-sm"
                      : row?.original?.status === Enum_StatusMedicao.EmAberto
                      ? "bullet bullet-warning bullet-sm"
                      : row?.original?.status === Enum_StatusMedicao.Validada
                      ? "bullet bullet-success bullet-sm"
                      : row?.original?.status === Enum_StatusMedicao.EmAprovacao
                      ? "bullet bullet-primary bullet-sm"
                      : row?.original?.status === Enum_StatusMedicao.AprovadaParcialmente
                      ? "bullet bullet-secondary bullet-sm"
                      : "bullet bullet-secondary bullet-sm"
                    }
                  ></span>
                );
              },
            },
            {
              Header: "Nº MEDIÇÃO",
              id: "codigo",
              accessor: (value) => value.codigo,
              filterAll: true,
              width: 120,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["codigo"] }),
            },
            {
              Header: "REVISÃO",
              id: "revisao",
              accessor: (value) => value.revisao,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["revisao"] }),
            },
            {
              Header: "DATA CRIAÇÃO",
              id: "data_criacao",
              accessor: (value) =>
                !value.data_criacao
                  ? "-"
                  : moment(value.data_criacao)
                      .local()
                      .format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["data_criacao"],
                }),
            },
            {
              Header: "EMPRESA",
              id: "empresa",
              accessor: (value) => value.empresa,
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
              accessor: (value) => value.cliente,
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
                matchSorter(rows, filter.value, { keys: ["contato"] }),
            },
            {
              Header: "VALOR TOTAL MEDIÇÃO",
              id: "valor_total",
              accessor: (value) => value.valor_total?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_total"] }),
            },
            {
              Header: "VENDEDOR RESP",
              id: "vendedor",
              accessor: (value) => value.vendedor,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["vendedor"] }),
            },
            {
              Header: "APROVAÇÃO INTERNA",
              id: "data_aprovacao_interna",
              accessor: (value) =>
                !value.data_aprovacao_interna
                  ? "-"
                  : moment(value.data_aprovacao_interna)
                      .local()
                      .format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["data_aprovacao_interna"],
                }),
            },
            {
              Header: "COBRANÇA ENVIADA",
              id: "data_cobranca",
              accessor: (value) =>
                !value.data_cobranca
                  ? "-"
                  : moment(value.data_cobranca).local().format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_cobranca"] }),
            },
            {
              Header: "DIAS DESDE A COBRANÇA",
              id: "DiasCobranca",
              accessor: (value) => DiffDatesInDays(moment(), value.data_cobranca ? moment(value.data_cobranca) : null),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["DiasCobranca"] }),
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
          noDataText="Não há medições para exibir"
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
        <ModalPrecificacao
          open={openPrecificar}
          handleClose={handleClosePrecificar}
          ordem={ordem}
          precificar={precificar}
        />
        <ModalEdicaoMedicao
          modalEdicao={modalEdicao}
          medicao={medicao}
          ordens={props.ordens}
          vendedores={props.aprovadores}
          handleClose={handleClose}
          handlePrecificar={handlePrecificar}
          alterarMedicao={alterarMedicao}
          alterarStatusMedicao={alterarStatusMedicao}
        />
        <ModalAprovarCobrancaMedicao
          medicao={medicao}
          handleClose={handleCloseAprovarCobranca}
          modalAprovar={modalAprovar}
          aprovar={aprovar}
        />
      </Card>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    medicoes: state?.medicao?.medicoes,
    medicao: state.medicao.medicao,
    isFinishedAction: state?.medicao?.isFinishedAction,
    error: state?.medicao?.error,
    print: state?.medicao?.print,
    send: state?.medicao?.send,
    clientes: state?.cliente?.listaClientesAtivos,
    aprovadores: state?.usuario?.aprovadores,
    stateCancelar: state?.medicao?.stateCancelar,
    stateSalvar: state?.medicao?.stateSalvar,
    statePrecificar: state?.medicao?.statePrecificar,
    ordens: state?.ordem.ordensMedicao
  };
};

export default connect(mapStateToProps, {
  buscarMedicoesRaw,
  buscarMedicao,
  buscarClientesAtivos,
  buscarAprovadoresMedicao,
  alterarMedicao,
  alterarStatusMedicao,
  cancelarMedicao,
  imprimirMedicao,
  enviarMedicao,
  reprovarMedicao,
  aprovarMedicao,
  buscarOrdensMedicao,
  precificar
})(MedicaoStatusMedicao);