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
import { FiEye, FiList } from "react-icons/fi";
import { formatNumberReal } from "../../../../../utility/number/index";
import moment from "moment";
moment.locale("pt-br");
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import Select from "react-select";
import ModalHistoricoContasReceber from "../modals/ModalHistoricoContasReceber";
import { Enum_StatusParcelaReceber,List_StatusContasRecebidos } from "../../../../../utility/enum/Enums";
import { buscarParcelas, buscarParcelaRecebida } from "../../../../../redux/actions/financeiro/contas-a-receber";
import { DiffDatesInDays } from "../../../../../utility/date/date";

const ContasReceberRecebidos = (props) => {
  const { selectedTipo } = props;
  const diasParaVencimento = 2;
  
  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState();
  const [contaRecebida, setContaRecebida] = useState({});

  const buscarContasRecebidas = (intervaloData) => {
    if (intervaloData?.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarParcelas(dataInicial, dataFinal, true);
      setLoadingSkeleton(true);
    }
  };

  useEffect(() => {
    if (selectedTipo === "Recebidos") {
      buscarContasRecebidas(intervaloData);
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setFilteredData(props?.parcelas);
    setLoadingSkeleton(false);
  }, [props?.parcelas]);

  useEffectAfterMount(() => {
    if (props.parcelaRecebida) {
      setContaRecebida({...contaRecebida, Parcela: props.parcelaRecebida})
      setModal(true)
    }
  }, [props.parcelaRecebida]);

  useEffectAfterMount(() => {
    buscarContasRecebidas(intervaloData);
  }, [intervaloData]);
  
  useEffectAfterMount(() => {
    if (props.parcelas) {
      let filteredData =
        status === Enum_StatusParcelaReceber.Todos
          ? props.parcelas
          : 
        status === Enum_StatusParcelaReceber.RecebidoComAtraso
          ? props.parcelas.filter((x) => x.data_vencimento && x.data_vencimento_real && DiffDatesInDays(moment(x.data_vencimento_real), moment(x.data_vencimento)) > diasParaVencimento)
          : props.parcelas.filter((x) => x.status_recebimento === status);
      setFilteredData(filteredData);
    }
  }, [status]);

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

  const handleClose = () => {
    setContaRecebida({})
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
              options={List_StatusContasRecebidos}
                isClearable
                isSearchable
                value={List_StatusContasRecebidos?.filter(
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
            <span>Recebidos com atraso</span>
          </div>
          <div className="tag mr-1">
            <span
              className="bullet bullet-secondary bullet-sm mr-50"
            ></span>
            <span>Recebimento parcial</span>
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
                  <FiEye
                  title="Visualizar"
                  style={{ margin: "5px" }}
                  size={20}
                  onClick={() => {
                    window.open(row.original.url_arquivo_nota, '_blank')
                  }}
                  />
                  <FiList
                    title="Listar"
                    style={{ margin: "5px" }}
                    size={20}
                    onClick={() => {
                      setContaRecebida({Conta: row.original})
                      props.buscarParcelaRecebida(row.original.id)
                    }}
                  />
                </div>
              );
            },
          },
          {
            Header: "STATUS",
            id: "status_recebido",
            accessor: "status_recebido",
            width: 80,
            filterable: false,
            Cell: (row) => {
              return (
                <span className={row?.original?.data_vencimento && row.original?.data_vencimento_real && DiffDatesInDays(moment(row.original.data_vencimento_real), moment(row.original.data_vencimento)) > diasParaVencimento ? "bullet bullet-danger bullet-sm" : 
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
            width: 120,
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
            accessor: "data_vencimento_real",
            filterAll: true,
            width: 120,
            accessor: (value) =>
              value.data_vencimento_real === "-" ||
              moment(value.data_vencimento_real).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_vencimento_real"] }),
            sortType: (a, b) => {
              return new Date(b.values.data_vencimento_real) - new Date(a.values.data_vencimento_real);
            },
          },
          {
            Header: "DIAS EM ATRASO",
            id: "dias_em_atraso",
            accessor: (value) => DiffDatesInDays(moment(value.data_vencimento_real), moment(value.data_vencimento)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
          },
          {
            Header: "TOTAL LÍQUIDO",
            id: "valor_total",
            accessor: (value) => formatNumberReal(value.valor_total?.toFixed(2)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_total"] }),
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
            accessor: (value) =>
              value.valor_recebido ? formatNumberReal(value.valor_recebido?.toFixed(2)) : '-',
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_recebido"] }),
          },
          {
            Header: "VALOR RECEBER(R$)",
            id: "valor_a_receber",
            accessor: (value) =>
              value.valor_a_receber || value.valor_a_receber === 0 ? formatNumberReal(value.valor_a_receber?.toFixed(2)) :  formatNumberReal(value.valor_parcela?.toFixed(2)),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["valor_a_receber", "valor_parcela"] }),
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
            Header: "PARCIAL",
            id: "status_recebimento",
            accessor: (value) => (value.status_recebimento === Enum_StatusParcelaReceber.Parcial ? 'Sim' : 'Não'),
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status_recebimento"] })
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
            Header: "OBSERVAÇÕES",
            id: "Observacoes",
            accessor: (value) => value?.observacoes,
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
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
      <ModalHistoricoContasReceber modal={modal} handleClose={handleClose} model={contaRecebida}/>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    item: state?.contaReceber?.item,
    parcelas: state?.contaReceber?.parcelas,
    parcelaRecebida: state?.contaReceber?.parcelaRecebida
  };
};

export default connect(mapStateToProps, {
  buscarParcelas,
  buscarParcelaRecebida
})(ContasReceberRecebidos);
