import React, { useState, useEffect } from "react";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import { connect } from "react-redux";
import {
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
} from "reactstrap";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import { matchSorter } from "match-sorter";
import { FiEdit2 } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatNumberReal } from "../../../../../utility/number/index";
import moment from "moment";
moment.locale("pt-br");
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import 'react-quill/dist/quill.snow.css'
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import Select from "react-select";
import { buscarParcelas, buscarContaReceber, buscarParcelaReceber, receberConta, salvarParcela, corrigirConta } from "../../../../../redux/actions/financeiro/contas-a-receber";
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import { Enum_StatusContasAReceber, Enum_StatusParcelaReceber, List_StatusParcelaReceber } from "../../../../../utility/enum/Enums";
import { DiffDatesInDays } from "../../../../../utility/date/date";
import ModalEditarContasReceber from "../modals/ModalEditarContasReceber";
import auth from "@src/services/auth"

const MySwal = withReactContent(Swal);

const user = auth.getUserInfo()

const ContasReceberReceber = (props) => {
  const { selectedTipo } = props;

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [initial, setInitial] = useState(true)
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState();
  const [conta, setConta] = useState({});
  const [parcela, setParcela] = useState({});

  const buscarContasAReceber = (intervaloData) => {
    if (intervaloData?.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarParcelas(dataInicial, dataFinal, false);
      setLoadingSkeleton(true);
    }
  };
  
  useEffect(() => {
    if (selectedTipo === "Receber") {
      buscarContasAReceber(intervaloData);
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setInitial(false);
    setFilteredData(props?.parcelas);
    setLoadingSkeleton(false);
  }, [props?.parcelas]);

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setInitial(true)
      buscarContasAReceber(intervaloData)
    }
  }, [props?.isFinishedAction, props?.stateSalvar])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      buscarContasAReceber(intervaloData)
    }
  }, [props?.error])

  useEffectAfterMount(() => {
    buscarContasAReceber(intervaloData);
  }, [intervaloData]);

  useEffectAfterMount(() => {
    if (props.parcelas) {
      let filteredData =
        status === Enum_StatusParcelaReceber.Todos
          ? props.parcelas
          : props.parcelas.filter((x) => x.status_recebimento === status);
      setFilteredData(filteredData);
    }
  }, [status]);

  useEffectAfterMount(() => {
    if (!props.item?.id || !props.parcelaReceber?.id) return
    setConta(props.item)
    setParcela(props.parcelaReceber)
    setLoadingSkeleton(false)
    setModal(true)
  }, [props?.item, props?.parcelaReceber]);

  const receber = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja efetuar o recebimento?",
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
        MySwal.fire({
          text: "Observação:",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Baixar",
          cancelButtonText: "Cancelar",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-primary mr-1"
          },
          reverseButtons: true,
          preConfirm: (value) => {
            data.Observacao = value ? value.toUpperCase() : ''
            data.UsuarioBaixa = user.email;
            data.Parcela.DataVencimentoReal = data.DataRecebimento;
            data.Parcela.ValorAReceber = data.Antecipar ? 0 : (data.Parcela.ValorAReceber + data.Parcela.ValorAcrescimo - data.Parcela.ValorDecrescimo) - (data.Valor)
            setInitial(false)
            setLoadingSkeleton(true)
            props.receberConta(data)
            handleClose()
          },
          buttonsStyling: false,
          showLoaderOnConfirm: true
        })
      }
    })
  }

  const salvar = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja salvar as informações?",
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
        setInitial(false)
        setLoadingSkeleton(true)
        props.salvarParcela(data)
        handleClose()
      }
    })
  }

  const corrigir = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja corrigir as informações?",
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
        setInitial(false)
        setLoadingSkeleton(true)
        props.corrigirConta({id: data.id, Status: Enum_StatusContasAReceber.EmCorrecao})
        handleClose()
      }
    })
  }

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Parcelas"
        messageBody="Soliciticação efetuada com sucesso!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Parcelas"
        messageBody="Falha na solicitação!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleClose = () => {
    setModal(false);
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

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
                options={List_StatusParcelaReceber}
                  isClearable
                  isSearchable
                  value={List_StatusParcelaReceber?.filter(
                    (option) => option.value === status
                  )}
                  onChange={(e) => {
                    setStatus(e ? e.value : Enum_StatusParcelaReceber.Todos);
                  }}
              />
            </FormGroup>
          </Col>
        </Row>
        <div className="event-tags d-none d-sm-flex mt-1">
          <div className="tag mr-1">
            <span
              className="bullet bullet-danger bullet-sm mr-50"
            ></span>
            <span>Recebimento atrasado</span>
          </div>
          <div className="tag mr-1">
            <span
              className="bullet bullet-secondary bullet-sm mr-50"
            ></span>
            <span>Recebimento parcial</span>
          </div>
        </div>
      </CardBody>

      <ReactTable
        loading={loadingSkeleton}
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
            width: 100,
            Cell: (row) => {
              return (
                <div>
                  <FiEdit2
                    title="Editar"
                    style={{ margin: "5px" }}
                    size={20}
                    onClick={() => {
                      setLoadingSkeleton(true)
                      props.buscarParcelaReceber(row.original.id)
                      props.buscarContaReceber(row.original.conta)
                    }}
                  />
                </div>
              );
            },
          },
          {
            Header: "STATUS",
            id: "status_recebimento",
            accessor: "status_recebimento",
            width: 80,
            filterable: false,
            Cell: (row) => {
              return (
                <span className={DiffDatesInDays(moment(), moment(row?.original?.data_vencimento_real)) > 0 ? "bullet bullet-danger bullet-sm" : 
                row?.original?.status_recebimento === Enum_StatusParcelaReceber.Parcial ? "bullet bullet-secondary bullet-sm" : "" }></span>
              );
            },
          },
          {
            Header: "ID",
            accessor: "conta",
            filterAll: true,
            width: 80,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["conta"] }),
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
            Header: "DATA RECEBIMENTO",
            id: "data_vencimento_real",
            accessor: (value) =>
              value.data_vencimento_real === "-" ||
              moment(value.data_vencimento_real).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_vencimento_real"] }),
            width: 120,
            sortType: (a, b) => {
              return new Date(b.values.data_vencimento_real) - new Date(a.values.data_vencimento_real);
            }
          },
          {
            Header: "DIAS EM ATRASO",
            id: "dias_em_atraso",
            accessor: (value) => DiffDatesInDays(moment(), moment(value.data_vencimento)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
          },
          {
            Header: "TOTAL LÍQUIDO",
            id: "valor_a_receber",
            accessor: (value) => value.status_recebimento === Enum_StatusParcelaReceber.Parcial ? formatNumberReal(value.valor_a_receber?.toFixed(2)) : formatNumberReal(value.valor_total?.toFixed(2)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_a_receber"] }),
          },
          {
            Header: "VALOR PARCELA",
            id: "valor_parcela",
            accessor: (value) => formatNumberReal(value.valor_parcela?.toFixed(2)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_parcela"] }),
          },
          {
            Header: "ACRÉSCIMO",
            id: "valor_acrescimo",
            accessor: (value) => formatNumberReal(value.valor_acrescimo?.toFixed(2)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_acrescimo"] }),
          },
          {
            Header: "DECRÉSCIMO",
            id: "valor_decrescimo",
            accessor: (value) => formatNumberReal(value.valor_decrescimo?.toFixed(2)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_decrescimo"] }),
          },
          {
            Header: "VALOR RECEBIDO",
            id: "valor_recebido",
            accessor: (value) => formatNumberReal(value.valor_recebido?.toFixed(2)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_recebido"] }),
          },
          {
            Header: "Nº PARCELA",
            id: "numero_parcela",
            accessor: (value) => `${value.numero_parcela} de ${value.quantidade_parcela}`,
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["numero_parcela"] }),
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
          },
          {
            Header: "DATA DE ENTRADA",
            id: "data_envio",
            accessor: (value) =>
              value.data_envio === "-" ||
              moment(value.data_envio).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_envio"] }),
            width: 150,
            sortType: (a, b) => {
              return new Date(b.values.data_envio) - new Date(a.values.data_envio);
            }
          },
          {
            Header: "TIPO INSERÇÃO",
            id: "insercao_manual",
            accessor: (value) => value?.insercao_manual ? 'MANUAL' : 'AUTOMÁTICO',
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["insercao_manual"] }),
          },
          {
            Header: "USUÁRIO",
            id: "Usuario",
            accessor: (value) => value?.usuario,
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
          }
        ]}
        defaultPageSize={10}
        noDataComponent="Ainda não existem"
        previousText={"Anterior"}
        nextText={"Próximo"}
        noDataText="Não há parcelas para exibir"
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

      <ModalEditarContasReceber conta={conta} parcela={parcela} modal={modal} handleClose={handleClose} salvar={salvar} receber={receber} corrigir={corrigir} />
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state?.medicao?.error,
    parcelas: state?.contaReceber?.parcelas,
    item: state?.contaReceber?.item,
    parcelaReceber: state?.contaReceber?.parcelaReceber,
    isFinishedAction: state?.contaReceber?.isFinishedAction,
    stateSalvar:state?.contaReceber?.stateSalvar
  };
};

export default connect(mapStateToProps, {
  buscarParcelas,
  buscarContaReceber,
  buscarParcelaReceber,
  receberConta,
  salvarParcela,
  corrigirConta
})(ContasReceberReceber);
