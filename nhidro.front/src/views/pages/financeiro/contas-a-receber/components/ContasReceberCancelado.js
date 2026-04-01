import React, { useState, useEffect } from "react";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import { connect } from "react-redux";
import {
  Card,
  CardBody,
  Row,
  Col,
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
import ModalHistoricoContasReceber from "../modals/ModalHistoricoContasReceber";
import { buscarContasReceberRaw } from "../../../../../redux/actions/financeiro/contas-a-receber";

const ContasReceberCancelados = (props) => {
  const { selectedTipo } = props;

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState(false);
  const [contaCancelada, setContaCancelada] = useState({});

  const buscarContasCanceladas = (intervaloData) => {
    if (intervaloData?.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarContasReceberRaw(dataInicial, dataFinal, true);
      setLoadingSkeleton(true);
    }
  };

  useEffect(() => {
    if (selectedTipo === "Cancelados") {
      buscarContasCanceladas(intervaloData);
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setFilteredData(props?.contasReceber);
    setLoadingSkeleton(false);
  }, [props?.contasReceber]);

  useEffectAfterMount(() => {
    buscarContasCanceladas(intervaloData);
  }, [intervaloData]);

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

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
        </Row>
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
          },
          {
            Header: "DATA CANCELAMENTO",
            id: "data_cancelamento",
            accessor: (value) =>
              value.data_cancelamento === "-" ||
              moment(value.data_cancelamento).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["data_cancelamento"] }),
            width: 150,
            sortType: (a, b) => {
              return new Date(b.values.data_cancelamento) - new Date(a.values.data_cancelamento);
            }
          },
          {
            Header: "MOTIVO CANCELAMENTO",
            id: "motivo_cancelamento",
            accessor: (value) => value.motivo_cancelamento,
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["motivo_cancelamento"] }),
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
      <ModalHistoricoContasReceber modal={modal} handleClose={handleClose} model={contaCancelada}/>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    contasReceber: state?.contaReceber?.contasReceber,
    item: state?.contaReceber?.item,
  };
};

export default connect(mapStateToProps, {
  buscarContasReceberRaw,
})(ContasReceberCancelados);
