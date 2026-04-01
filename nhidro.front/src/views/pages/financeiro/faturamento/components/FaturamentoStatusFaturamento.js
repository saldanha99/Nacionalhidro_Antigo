import React, { useState, useEffect } from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/pages/data-list.scss";
import { Row, Col, FormGroup, CardBody, Card, Button } from "reactstrap";
import Select from "react-select";
import moment from "moment";
import { ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import {
  List_StatusFaturamento,
  Enum_StatusFaturamento,
} from "../../../../../utility/enum/Enums";
import { connect } from "react-redux";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import {
  FiEdit,
  FiXCircle,
  FiSend,
  FiList,
  FiEye,
  FiCopy
} from "react-icons/fi";
import { buscarFaturamentosRaw, buscarFaturamento, alterarFaturamento, gerarFaturamento, enviarFaturamento, cancelarFaturamento, clonarFaturamento, emitirNFS } from "../../../../../redux/actions/financeiro/faturamento";
import { buscarContatosCliente } from "../../../../../redux/actions/administrador/cliente/listaClientesActions";
import { buscarEmpresas } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import ModalEdicaoFaturamento from "../modals/ModalEdicaoFaturamento";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ModalHistoricoFaturamento from "../modals/ModalHistoricoFaturamento";
import ModalEnvioFaturamento from "../modals/ModalEnvioFaturamento";
import { matchSorter } from "match-sorter";
import ModalClonarFaturamento from "../modals/ModalClonarFaturamento";
import ModalEmitirNFS from "../modals/ModalEmitirNFS";
import { ArrowLeftCircle } from "react-feather";

const MySwal = withReactContent(Swal);

const FaturamentoStatusFaturamento = (props) => {
  const { selectedTipo } = props;

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [status, setStatus] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [faturamento, setFaturamento] = useState({});
  const [modal, setModal] = useState(false);
  const [modalHistory, setHistory] = useState(false);
  const [modalSend, setModalSend] = useState(false);
  const [modalCopy, setModalCopy] = useState(false);
  const [modalNFS, setModalNFS] = useState(false);

  const buscarFaturamentos = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).format("YYYY-MM-DD");

      props.buscarFaturamentosRaw(dataInicial, dataFinal, false);
      setLoadingSkeleton(true);
    }
  };

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Faturamento"
        messageBody="Faturamento salvo!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Faturamento"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleCloseHistory = () => {
    setHistory(false);
  }

  const handleCloseSend = () => {
    setModalSend(false);
  }

  const handleCloseCopy = () => {
    setModalCopy(false);
  }

  const handleCloseNFS = () => {
    setModalNFS(false);
  };

  useEffect(() => {
    if (selectedTipo === "Status_do_Faturamento") {
      buscarFaturamentos(intervaloData);
      props.buscarEmpresas()
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setFilteredData(props?.faturamentos);
    setLoadingSkeleton(false);
  }, [props?.faturamentos]);

  useEffectAfterMount(() => {
    if (!props.faturamento) return
  
    const cliente = props.faturamento.Cliente
    if (!cliente.Cnpj || (props.faturamento.TipoFatura === 'CTE' && !cliente.Ie) || !cliente.RazaoSocial || !cliente.Endereco || !cliente.Numero || !cliente.Bairro || !cliente.CodigoMunicipio || !cliente.EstadoSigla || !cliente.Cep) {
      MySwal.fire('Alerta!', `Está faltando informações do cliente ${cliente.RazaoSocial}, pode ser que ocorra erro na emissão. Favor informar todos os campos no cadastro do Cliente!`, 'warning')
    }

    if (props.faturamento.TipoFatura === 'CTE' || props.faturamento.TipoFatura === 'NF') {
      const empresa = props.faturamento.Empresa
      if ((props.faturamento.TipoFatura === 'CTE' && !empresa.Rntrc) || (props.faturamento.TipoFatura === 'NF' && !empresa.Cnae) || !empresa.CNPJ || !empresa.InscricaoEstadual || !empresa.Descricao || !empresa.Logradouro || !empresa.Numero || !empresa.Bairro || !empresa.Municipio || !empresa.UF) {
        MySwal.fire('Alerta!', `Está faltando informações da empresa ${empresa.Descricao}, pode ser que ocorra erro na emissão. Favor informar todos os campos no cadastro da Empresa!`, 'warning')
      }
    }

    setFaturamento(props.faturamento)
    setLoadingSkeleton(false)
    setModal(true)
  }, [props?.faturamento]);

  useEffectAfterMount(() => {
    buscarFaturamentos(intervaloData);
  }, [intervaloData]);

  useEffectAfterMount(() => {
    buscarFaturamentos(intervaloData);
    handleToastSuccess()
    setLoadingSkeleton(false);
  }, [props?.stateSalvar]);

  useEffectAfterMount(() => {
    // handleCloseNFS();
    MySwal.fire('Sucesso!', `A nota foi emitida, favor conferir no portal da Focus, pela url https://app-v2.focusnfe.com.br. A referência para encontrar a nota é "${props.stateNFS?.data}".`, 'success')
    console.log(props.stateNFS);
  }, [props?.stateNFS]);

  useEffectAfterMount(() => {
    MySwal.fire('Falha ao emitir!', `A nota  não foi emitida, favor conferir no portal da Focus, pela url https://app-v2.focusnfe.com.br, qual a razão do erro.`, 'error')
  }, [props?.errorNFS]);

  useEffectAfterMount(() => {
    if (props.stateCancelar?.msg) MySwal.fire('Atenção!', props.stateCancelar.msg.mensagem, 'warning')
    buscarFaturamentos(intervaloData);
    handleToastSuccess()
    setLoadingSkeleton(false);
  }, [props?.stateCancelar]);

  useEffectAfterMount(() => {
    if (props.error?.msg) MySwal.fire('Erro!', props.error.msg.mensagem, 'error')
    handleToastError()
    setLoadingSkeleton(false)
  }, [props?.error])

  useEffectAfterMount(() => {
    if (props.faturamentos) {
      let filteredData =
        status === Enum_StatusFaturamento.Todos
          ? props.faturamentos
          : props.faturamentos.filter((x) => x.status === status);
      setFilteredData(filteredData);
    }
  }, [status]);

  const save = (data) => {
    MySwal.fire({
      title: `Emissão da Fatura: Medição ${faturamento?.Medicao?.Codigo} | Revisão ${faturamento?.Medicao?.Revisao}`,
      text: "Tem certeza que deseja salvar as informações?\n\  Para gerar a fatura, utilizar botão Gerar Fatura.",
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
        handleClose();
        setLoadingSkeleton(true);
        props.alterarFaturamento(data.id, data);
      }
    });
  };

  const reprocessar = (data) => {
    MySwal.fire({
      title: `Reprocessamento Fiscal Fatura: Medição ${data.medicao} | Revisão ${data.medicao_revisao}`,
      icon: "warning",
      text: "A Fatura voltará para o status 'Em aberto'. Deseja continuar?",
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
        setLoadingSkeleton(true);
        const model = {}
          model.id = data.id
          model.Nota = null
          model.DataEnvio = null
          model.DataEmissao = null
          model.UrlArquivoNota = null
          model.Revisao = model.Revisao ? model.Revisao + 1 : 1
          model.Status = Enum_StatusFaturamento.EmAberto
          model.StatusRecebimento = null
          props.alterarFaturamento(data.id, model);
      }
    });
  };

  const cancelar = (data) => {
    MySwal.fire({
      title: `Cancelamento Fiscal Fatura: Medição ${data.medicao} | Revisão ${data.medicao_revisao}`,
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
            setLoadingSkeleton(true);
            const model = {}
            model.id = data.id
            model.MotivoCancelamento = value;
            model.DataCancelamento = new Date();
            model.Status = Enum_StatusFaturamento.Cancelado
            data.tipo_fatura !== 'RL' && data.status !== Enum_StatusFaturamento.EmAberto ? props.cancelarFaturamento(model) : props.alterarFaturamento(data.id, model);
          },
          buttonsStyling: false,
          showLoaderOnConfirm: true,
        });
      }
    });
  };

  const saveSend = (data) => {
    MySwal.fire({
      title: `Fatura: Medição ${faturamento?.medicao} | Revisão ${faturamento?.medicao_revisao}`,
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
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        setLoadingSkeleton(true);
        props.enviarFaturamento({ data });
        setModalSend(false)
      }
    });
  };

  const saveCopy = (data) => {
    MySwal.fire({
      title: `Fatura: Clonar da Medição ${faturamento?.medicao} | Revisão ${faturamento?.medicao_revisao}. Para Medição ${data?.to?.medicao} | Revisão ${data?.to?.medicao_revisao}.`,
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
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        setLoadingSkeleton(true);
        props.clonarFaturamento(data);
        setModalCopy(false)
      }
    });
  };

  const gerar = (data) => {
    MySwal.fire({
      title: `Emissão de Fatura: Medição ${data?.Medicao?.Codigo} | Revisão ${data?.Medicao?.Revisao}`,
      text: "Tem certeza que deseja Gerar a Fatura?",
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
        handleClose()
        props.gerarFaturamento({ data });
      }
    });
  };

  const gerarNFS = (data) => {
    MySwal.fire({
      title: `Emissão de NFSe. Após geração acompanhar pelo portal da Focus!`,
      text: "Tem certeza que deseja Gerar a Fatura?",
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
        props.emitirNFS({ data });
      }
    });
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
                disabled={loadingSkeleton}
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
                  options={List_StatusFaturamento}
                  isClearable
                  isSearchable
                  value={List_StatusFaturamento?.filter(
                    (option) => option.value === status
                  )}
                  onChange={(e) => {
                    setStatus(e ? e.value : Enum_StatusFaturamento.Todos);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md="6"
              style={{
                textAlign: "right",
                marginLeft: "auto",
                marginTop: "20px",
              }}>
              <Button
                color="primary"
                onClick={() => {
                  // setContaAReceber({})
                  setModalNFS(true)
                }}
                className="text-size-button mr-1">
                Emitir NFSe
              </Button>
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
                <span>Processando</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-info bullet-sm mr-50"></span>
                <span>Emitido</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-success bullet-sm mr-50"></span>
                <span>Enviado</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-danger bullet-sm mr-50"></span>
                <span>Reprocessar</span>
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
                    {row.original.status !== Enum_StatusFaturamento.Falha ? <FiXCircle
                      title="Cancelar"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        cancelar(row.original);
                      }}
                    /> : <ArrowLeftCircle
                      title="Reprocessar"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        reprocessar(row.original);
                      }}
                    />}
                    {row.original.url_arquivo_nota &&
                      <FiEye
                        title="Visualizar"
                        style={{ margin: "5px" }}
                        size={20}
                        onClick={() => {
                          window.open(row.original.url_arquivo_nota, '_blank')
                        }}
                      />
                    }
                    {row.original.status === Enum_StatusFaturamento.EmAberto &&
                      <FiEdit
                        title="Editar"
                        style={{ margin: "5px" }}
                        size={20}
                        onClick={() => {
                          setLoadingSkeleton(true)
                          props.buscarFaturamento(row.original.id)
                        }}
                      />
                    }
                    {row.original.status === Enum_StatusFaturamento.Emitido &&
                      <FiSend
                        title="Enviar"
                        style={{ margin: "5px" }}
                        size={20}
                        onClick={() => {
                          props.buscarContatosCliente(row.original.cliente_id)
                          setFaturamento(row.original)
                          setModalSend(true);
                        }}
                      />
                    }
                    {row.original.status === Enum_StatusFaturamento.Enviado &&
                      <FiList
                        title="Listar"
                        style={{ margin: "5px" }}
                        size={20}
                        onClick={() => {
                          setFaturamento(row.original)
                          setHistory(true)
                        }}
                      />
                    }
                    {row.original.tipo_fatura === 'CTE' &&
                      <FiCopy
                        title="Clonar"
                        style={{ margin: "5px" }}
                        size={20}
                        onClick={() => {
                          setFaturamento(row.original)
                          setModalCopy(true)
                        }}
                      />
                    }
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
                  <span style={row.original.status === Enum_StatusFaturamento.Processando ? { backgroundColor: "#D66BFC" } : {}} className={row?.original?.status === Enum_StatusFaturamento.EmAberto
                    ? "bullet bullet-warning bullet-sm"
                    : row?.original?.status === Enum_StatusFaturamento.Enviado
                      ? "bullet bullet-success bullet-sm"
                      : row?.original?.status === Enum_StatusFaturamento.Emitido
                        ? "bullet bullet-info bullet-sm" : "bullet bullet-danger bullet-sm"}>
                  </span>
                );
              },
            },
            {
              Header: "Nº MEDIÇÃO",
              id: "medicao",
              accessor: (value) => `${value?.medicao}/${value?.medicao_revisao}`,
              filterAll: true,
              width: 120,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["medicao"] }),
            },
            {
              Header: "Nº FAT",
              id: "nota",
              accessor: (value) => value?.nota,
              filterAll: true,
              width: 120,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["nota"] }),
            },
            {
              Header: "TIPO FATURA",
              id: "tipo_fatura",
              accessor: (value) => value?.tipo_fatura,
              filterAll: true,
              width: 120,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["tipo_fatura"] }),
            },
            {
              Header: "DATA EMISSÃO",
              id: "data_emissao",
              accessor: (value) => value?.data_emissao ? moment.utc(value.data_emissao).format("DD/MM/YYYY") : '-',
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
            },
            {
              Header: "EMPRESA",
              id: "empresa",
              accessor: (value) => value?.empresa,
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
              Header: "CNPJ CLIENTE",
              id: "cliente_cnpj",
              accessor: (value) => value?.cliente_cnpj,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["cliente_cnpj"] }),
            },
            {
              Header: "CLIENTE",
              id: "cliente",
              accessor: (value) => value?.cliente,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["cliente"] }),
            },
            {
              Header: "CONTATO",
              id: "contato",
              accessor: (value) => value?.contato,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["contato"] }),
            },
            {
              Header: "VENCIMENTO",
              id: "data_vencimento",
              accessor: (value) => value?.data_vencimento ? moment.utc(value.data_vencimento).format("DD/MM/YYYY") : '-',
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
            },
            {
              Header: "COBRANÇA ENVIADA",
              id: "data_cobranca",
              accessor: (value) => value?.data_cobranca ? moment.utc(value.data_cobranca).format("DD/MM/YYYY") : '-',
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_cobranca"] }),
            },
            {
              Header: "VALOR BRUTO",
              id: "valor_rateado",
              accessor: (value) => 'R$ ' + value?.valor_rateado?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_rateado"] }),
            },
            {
              Header: "ISS",
              id: "valor_iss",
              accessor: (value) => 'R$ ' + (value?.valor_iss || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_iss"] }),
            },
            {
              Header: "INSS",
              id: "valor_inss",
              accessor: (value) => 'R$ ' + (value?.valor_inss || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_inss"] }),
            },
            {
              Header: "PIS",
              id: "valor_pis",
              accessor: (value) => 'R$ '+ (value?.valor_pis || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_pis"] }),
            },
            {
              Header: "COFINS",
              id: "valor_cofins",
              accessor: (value) => 'R$ '+ (value?.valor_cofins || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_cofins"] }),
            },
            {
              Header: "IR",
              id: "valor_ir",
              accessor: (value) => 'R$ '+ (value?.valor_ir || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_ir"] }),
            },
            {
              Header: "CSLL",
              id: "valor_csll",
              accessor: (value) => 'R$ '+ (value?.valor_csll || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_csll"] }),
            },
            {
              Header: "VALOR LÍQUIDO",
              id: "valor_liquido",
              accessor: (value) => 'R$ ' + (value.valor_liquido || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_liquido"] }),
            }
          ]}
          defaultPageSize={10}
          defaultSorted={[
            {
              id: "medicao",
              desc: true,
            },
          ]}
          noDataComponent="Ainda não existem"
          previousText={"Anterior"}
          nextText={"Próximo"}
          noDataText="Não há faturamento para exibir"
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
        <ModalEdicaoFaturamento faturamento={faturamento} modal={modal} handleClose={handleClose} save={save} gerar={gerar} />
        <ModalEmitirNFS modal={modalNFS} handleClose={handleCloseNFS} gerar={gerarNFS} empresas={props.empresas} />
        <ModalHistoricoFaturamento modal={modalHistory} handleClose={handleCloseHistory} model={faturamento} />
        <ModalEnvioFaturamento modal={modalSend} faturamento={faturamento} handleClose={handleCloseSend} save={saveSend} contatos={props.contatos} />
        <ModalClonarFaturamento modal={modalCopy} faturamento={faturamento} handleClose={handleCloseCopy} save={saveCopy} faturamentos={props.faturamentos} />
      </Card>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    ordens: state?.ordem.ordensMedicao,
    contatos: state.cliente.contatos,
    faturamentos: state?.faturamento?.faturamentos,
    faturamento: state?.faturamento?.item,
    stateSalvar: state?.faturamento?.stateSalvar,
    stateNFS: state?.faturamento?.stateNFS,
    stateCancelar: state?.faturamento?.stateCancelar,
    error: state?.faturamento?.error,
    errorNFS: state?.faturamento?.errorNFS,
    empresas: state?.empresa?.empresas
  };
};

export default connect(mapStateToProps, {
  alterarFaturamento,
  buscarFaturamentosRaw,
  buscarContatosCliente,
  buscarFaturamento,
  buscarEmpresas,
  gerarFaturamento,
  emitirNFS,
  enviarFaturamento,
  cancelarFaturamento,
  clonarFaturamento
})(FaturamentoStatusFaturamento);
