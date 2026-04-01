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
import {
  List_MedicoesFinalizadas,
  Enum_MedicoesFinalizadas,
  Enum_StatusMedicao,
} from "../../../../../utility/enum/Enums";
import { connect } from "react-redux";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import {
  FiList, FiEye
} from "react-icons/fi";
import { buscarMedicoesRaw, imprimirMedicao, alterarStatusMedicao } from "@src/redux/actions/financeiro/medicao/index";
import { DiffDatesInDays } from "../../../../../utility/date/date";
import ModalHistoricoMedicao from "../modals/ModalHistoricoMedicao";
import { matchSorter } from "match-sorter";
import { ArrowLeftCircle } from "react-feather";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content";
import { ToastContent } from "../../../../../utility/Utils";
import { Slide, toast } from "react-toastify";

const MySwal = withReactContent(Swal)

const MedicoesFinalizadas = (props) => {
  const { selectedTipo } = props;
  const diasParaVencimento = 2

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [status, setStatus] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [medicao, setMedicao] = useState({});
  const [modal, setModal] = useState(false);
  const [dataPrint, setDataPrint] = useState({})

  const buscarMedicoes = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarMedicoesRaw(dataInicial, dataFinal, true);
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

  const corrigir = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja voltar a Medição para correção?",
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
            Status: Enum_StatusMedicao.EmAprovacao,
            ValorAprovado: null
          }
          props.alterarStatusMedicao({data: model})
        }
      })
  }

  useEffect(() => {
    if (selectedTipo === "Medições_Finalizadas") {
      buscarMedicoes(intervaloData);
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setFilteredData(props?.medicoes);
    setLoadingSkeleton(false);
  }, [props?.medicoes]);

  useEffectAfterMount(() => {
    handleToastSuccess();
    buscarMedicoes(intervaloData);
  }, [props?.stateSalvar]);

  useEffectAfterMount(() => {
    buscarMedicoes(intervaloData);
  }, [intervaloData]);

  useEffectAfterMount(() => {
    if (props.medicoes) {
      let filteredData =
        status === Enum_MedicoesFinalizadas.Todos
          ? props.medicoes
          : status === Enum_MedicoesFinalizadas.ComAtraso
          ? props.medicoes.filter((x) => DiffDatesInDays(moment(x.data_aprovacao), moment(x.data_cobranca)) > diasParaVencimento)
          : props.medicoes.filter((x) => DiffDatesInDays(moment(x.data_aprovacao), moment(x.data_cobranca)) <= diasParaVencimento)
      setFilteredData(filteredData);
    }
  }, [status]);

  useEffectAfterMount(() => {
    if (!props.print?.data) return
    const blob = new Blob([new Uint8Array(props?.print?.data)], { type: 'application/pdf' })
    var fileURL = window.URL.createObjectURL(blob)
    let tab = window.open()
    tab.location.href = fileURL
    setDataPrint({})
  }, [props?.print])

  const handleClose = () => {
    setModal(false)
  }

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
                  options={List_MedicoesFinalizadas}
                  isClearable
                  isSearchable
                  value={List_MedicoesFinalizadas?.filter(
                    (option) => option.value === status
                  )}
                  onChange={(e) => {
                    setStatus(e ? e.value : Enum_MedicoesFinalizadas.Todos);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Col md="8">
            <div className="event-tags d-none d-sm-flex mt-1">
              <div className="tag mr-1">
                <span
                  style={{ backgroundColor: "#10FF50" }}
                  className="bullet bullet-success bullet-sm mr-50"
                ></span>
                <span>Aprovada no Prazo</span>
              </div>
              <div className="tag mr-1">
                <span className="bullet bullet-warning bullet-sm mr-50"></span>
                <span>Aprovada com Atraso</span>
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
                    <ArrowLeftCircle
                      title="Corrigir"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        corrigir(row.original);
                      }}
                    />
                    {row.original.id === dataPrint.id ? <Spinner size={20} /> : <FiEye
                      title="Visualizar PDF"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        setDataPrint(row.original)
                        props.imprimirMedicao(row.original);
                      }}
                    />}
                    <FiList
                      title="Listar"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        setMedicao(row.original);
                        setModal(true);
                      }}
                    />
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
                  <>
                  {DiffDatesInDays(moment(row.original?.data_aprovacao), moment(row.original?.data_cobranca)) <= diasParaVencimento ? (
                      <span style={{ backgroundColor: "#10FF50" }}
                      className="bullet bullet-success bullet-sm mr-50"></span>
                  ) : (
                      <span className="bullet bullet-warning bullet-sm mr-50"></span>
                  )}
                  </>
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
              Header: "APROVAÇÃO CLIENTE",
              id: "data_aprovacao",
              accessor: (value) =>
                !value.data_aprovacao
                  ? "-"
                  : moment(value.data_aprovacao).local().format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_aprovacao"] }),
            },
            {
              Header: "DIAS ATÉ A APROV.",
              id: "DiasCobranca",
              accessor: (value) => DiffDatesInDays(moment(value.data_aprovacao), moment(value.data_cobranca)),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["DiasCobranca"] }),
            }
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
        <ModalHistoricoMedicao modal={modal} handleClose={handleClose} model={medicao}/>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    medicoes: state?.medicao?.medicoes,
    error: state?.medicao?.error,
    print: state?.medicao?.print,
    clientes: state?.cliente?.listaClientesAtivos,
    stateSalvar: state?.medicao?.stateSalvar
  };
};

export default connect(mapStateToProps, {
  buscarMedicoesRaw,
  imprimirMedicao,
  alterarStatusMedicao
})(MedicoesFinalizadas);
