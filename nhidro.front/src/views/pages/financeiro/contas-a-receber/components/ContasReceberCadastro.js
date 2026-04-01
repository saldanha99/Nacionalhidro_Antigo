import React, { useState, useEffect } from "react";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import { connect } from "react-redux";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  FormGroup,
  Alert,
} from "reactstrap";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import { matchSorter } from "match-sorter";
import { FiEdit2, FiSend, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatNumberReal } from "../../../../../utility/number/index";
import moment from "moment";
moment.locale("pt-br");
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import Select from "react-select";
import ModalContasCadastrar from "../modals/ModalContasCadastrar";
import { Enum_StatusContasAReceber, List_StatusContasAReceber } from "../../../../../utility/enum/Enums";
import { buscarContaReceber, buscarContasReceberRaw, adicionarContaReceber, alterarContaReceber, cancelarContaReceber, enviarContaReceber, validarNotaReceber } from "@src/redux/actions/financeiro/contas-a-receber";
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import { buscarFaturamentosEnviados } from "../../../../../redux/actions/financeiro/faturamento";
import { buscarClientesAtivos } from "@src/redux/actions/administrador/cliente/listaClientesActions";
import { buscarCentroCusto } from "@src/redux/actions/administrador/centro-custo/buscarCentroCustoActions";
import { buscarNatureza } from "@src/redux/actions/administrador/natureza-contabil/buscarNaturezaActions";
import { buscarEmpresas } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions";
import { AlertCircle } from "react-feather";

const MySwal = withReactContent(Swal);

const ContasReceberCadastro = (props) => {
  const { selectedTipo } = props;

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [initial, setInitial] = useState(true)
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState();
  const [contaAReceber, setContaAReceber] = useState({});
  const [faturamentosAlerta, setFaturamentosAlerta] = useState([]);
  const [notaIsValid, setNotaIsValid] = useState(props.notaIsValid)
  
  const buscarContasAReceber = (intervaloData) => {
    if (intervaloData?.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarContasReceberRaw(dataInicial, dataFinal);
      setLoadingSkeleton(true);
    }
  };

  const buscarFaturamentos = (search) => {
    if (search?.Periodo && search.Periodo.length && search.Periodo[0] && search.Periodo[1]) {
      const dataInicial = moment(search.Periodo[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(search.Periodo[1]).local().format("YYYY-MM-DD");

      props.buscarFaturamentosEnviados(dataInicial, dataFinal, search.Cliente);
    } else {
      props.buscarFaturamentosEnviados(null, null, search?.Cliente);
    }
  };

  useEffect(() => {
    if (selectedTipo === "Cadastro") {
      buscarContasAReceber(intervaloData);
      props.buscarCentroCusto();
      props.buscarNatureza();
      props.buscarClientesAtivos();
      props.buscarEmpresas();
      buscarFaturamentos();
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setFilteredData(props?.contasReceber);
    setLoadingSkeleton(false);
  }, [props?.contasReceber]);

  useEffectAfterMount(() => {
    if (!initial) return;
    setInitial(false);
    setFaturamentosAlerta(props.faturamentos)
  }, [props?.faturamentos]);

  useEffectAfterMount(() => {
    if (!props.contasReceber) return
    setContaAReceber(props.contasReceber)
    setLoadingSkeleton(false)
    setModal(true)
  }, [props?.item]);

  useEffectAfterMount(() => {
    buscarContasAReceber(intervaloData);
  }, [intervaloData]);
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setInitial(true)
      buscarContasAReceber(intervaloData)
      buscarFaturamentos()
    }
  }, [props?.stateSalvar])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      buscarContasAReceber(intervaloData)
    }
  }, [props?.error])

  useEffectAfterMount(() => {
    if (props.contasReceber) {
      let filteredData =
        status === Enum_StatusContasAReceber.Todos
          ? props.contasReceber
          : props.contasReceber?.filter((x) => x.status === status);
      setFilteredData(filteredData);
    }
  }, [status]);

  useEffectAfterMount(() => {
    if (!props.item) return
    setContaAReceber(props.item)
    setLoadingSkeleton(false)
    setModal(true)
  }, [props?.item]);
  
  useEffectAfterMount(() => {
    setNotaIsValid(props.notaIsValid)
  }, [props.notaIsValid])

  const validarNota = (numero, empresaId, tipo) => {
    if (numero && empresaId && tipo) props.validarNotaReceber(numero, empresaId, tipo)
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Contas"
        messageBody="Soliciticação efetuada com sucesso!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Contas"
        messageBody="Falha na solicitação!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const cancelar = (data) => {
    MySwal.fire({
      title: `Conta a Receber: Nota Nº ${data.nota}`,
      icon: "warning",
      text: "Tem certeza que deseja cancelar a Conta?",
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
                Status: Enum_StatusContasAReceber.Cancelado
              }
              setLoadingSkeleton(true);
              props.cancelarContaReceber(model);
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

  const send = (data) => {
    MySwal.fire({
      title: `Conta a Receber: Nota Nº ${data.nota}`,
      text: "Tem certeza que deseja enviar Nota para Receber?",
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
        if (!data.naturezas_contabeis || !data.centros_custo) return MySwal.fire('Atenção', 'Favor completar o cadastro da conta antes de prosseguir!', 'warning')
        const model = {
          id: data.id,
          DataEnvio: new Date(),
          Status: Enum_StatusContasAReceber.Pendente
        }
        setLoadingSkeleton(true);
        props.enviarContaReceber(model);
      }
    });
  };

  const save = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja salvar os dados?",
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
    })
    .then((result) => {
      if (result.value) {
        setLoadingSkeleton(true)
        handleClose()
        if (!data.id) props.adicionarContaReceber(data)
        else props.alterarContaReceber(data)
      }
    })
  }

  const handleClose = () => {
    setModal(false);
  }

  return (
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
                  instance.setDate([selectedDates[0], selectedDates[0]], true);
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
              options={List_StatusContasAReceber}
                isClearable
                isSearchable
                value={List_StatusContasAReceber?.filter(
                  (option) => option.value === status
                )}
                onChange={(e) => {
                  setStatus(e ? e.value : Enum_StatusContasAReceber.Todos);
                }}
            />
            </FormGroup>
          </Col>
          <Col md="6"
            style={{
              justifyContent: "end",
              display: "inline-flex",
              marginLeft: "auto",
              marginTop: "20px",
            }}>
            {faturamentosAlerta?.length > 0 && <Alert style={{marginRight: 10, paddingTop: 10, borderRadius: 28, width: 240}} color='danger' ico><AlertCircle size={15} /> Existem {faturamentosAlerta.length} Notas a serem cadastradas!</Alert>}
            <Button
              color="primary"
              onClick={() => {
                setContaAReceber({})
                setModal(true)
              }}
              className="text-size-button mr-1">
              Cadastrar Recebimento
            </Button>
          </Col>
        </Row>
        <div className="event-tags d-none d-sm-flex mt-1">
          <div className="tag mr-1">
            <span
              style={{ backgroundColor: "#2F4B74" }}
              className="bullet bullet-warning bullet-sm mr-50"
            ></span>
            <span>Contas em Correção</span>
          </div>
        </div>
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
                  <FiXCircle
                    title="Cancelar"
                    style={{ margin: "5px" }}
                    size={20}
                    onClick={() => {
                      cancelar(row.original);
                    }}
                  />
                  <FiEdit2
                    title="Editar"
                    style={{ margin: "5px" }}
                    size={20}
                    onClick={() => {
                      setLoadingSkeleton(true)
                      props.buscarContaReceber(row.original.id)
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
                </div>
              );
            },
          },
          {
            Header: "STATUS",
            id: "status",
            accessor: "status",
            width: 80,
            filterable: false,
            Cell: (row) => {
              return (
                row.original.status === Enum_StatusContasAReceber.EmCorrecao ?  <span
                  style={{ backgroundColor: "#2F4B74" }}
                  className="bullet bullet-info bullet-sm ml-1"
                ></span> : ''
              );
            },
          },
          {
            Header: "ID",
            accessor: "id",
            filterAll: true,
            width: 80,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["id"] }),
          },
          {
            Header: "Nº FAT",
            accessor: "nota",
            filterAll: true,
            width: 80,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["nota"] }),
          },
          {
            Header: "TIPO FATURA",
            accessor: "tipo_fatura",
            filterAll: true,
            width: 80,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["tipo_fatura"] }),
          },
          {
            Header: "DATA EMISSÃO",
            id: "data_emissao",
            accessor: (value) =>
              value.data_emissao === "-" ||
              moment(value.data_emissao).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
            width: 150,
            sortType: (a, b) => {
              return new Date(b.values.data_emissao) - new Date(a.values.data_emissao);
            }
          },
          {
            Header: "EMPRESA",
            id: "empresa",
            accessor: (value) => value.empresa || "-",
            filterAll: true,
            width: 150,
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
            accessor: (value) => value.cliente_cnpj,
            filterAll: true,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["cliente_cnpj"] }),
          },
          {
            Header: "CLIENTE",
            id: "cliente",
            accessor: (value) => value.cliente || "-",
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["cliente"] }),
          },
          {
            Header: "VENCIMENTO",
            id: "data_vencimento",
            accessor: (value) =>
              value.data_vencimento === "-" ||
              moment(value.data_vencimento).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
            width: 120,
            sortType: (a, b) => {
              return new Date(b.values.data_vencimento) - new Date(a.values.data_vencimento);
            }
          },
          {
            Header: "VALOR TOTAL",
            id: "valor_total",
            accessor: (value) =>
              formatNumberReal(value.valor_total?.toFixed(2)) || "-",
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_total"] }),
          },
          {
            Header: "CENTROS DE CUSTO",
            accessor: "centros_custo",
            filterAll: true,
            width: 180,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["centros_custo"] }),
          },
          {
            Header: "NATUREZAS CONTÁBEIS",
            accessor: "naturezas_contabeis",
            filterAll: true,
            width: 180,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["naturezas_contabeis"] }),
          }
        ]}
        defaultPageSize={10}
        defaultSorted={[
          {
            id: "id",
            desc: true,
          },
        ]}
        noDataComponent="Ainda não existem"
        previousText={"Anterior"}
        nextText={"Próximo"}
        noDataText="Não há contas a receber para exibir"
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
      <ModalContasCadastrar data={contaAReceber} modal={modal} handleClose={handleClose} save={save} validarNota={validarNota} setNotaIsValid={setNotaIsValid} notaIsValid={notaIsValid} faturamentos={props.faturamentos} buscarFaturamentos={buscarFaturamentos} centros={props.centros} naturezas={props.naturezas} clientes={props.clientes} empresas={props.empresas} />
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    clientes: state?.cliente?.listaClientesAtivos,
    empresas: state?.empresa?.empresas,
    error: state?.contaReceber?.error,
    stateSalvar: state?.contaReceber?.stateSalvar,
    faturamentos: state?.faturamento?.faturamentos,
    item: state?.contaReceber?.item,
    contasReceber: state?.contaReceber?.contasReceber,
    centros: state?.centro?.lista,
    naturezas: state?.natureza?.lista,
    notaIsValid: state?.contaReceber?.notaIsValid
  };
};

export default connect(mapStateToProps, {
  buscarFaturamentosEnviados,
  buscarContaReceber,
  buscarContasReceberRaw,
  buscarClientesAtivos,
  buscarEmpresas,
  buscarNatureza,
  buscarCentroCusto,
  adicionarContaReceber,
  alterarContaReceber,
  cancelarContaReceber,
  enviarContaReceber,
  validarNotaReceber
})(ContasReceberCadastro);
