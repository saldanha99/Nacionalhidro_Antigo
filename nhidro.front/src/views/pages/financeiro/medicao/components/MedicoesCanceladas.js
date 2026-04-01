import React, { useState, useEffect } from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/pages/data-list.scss";
import { Row, Col, CardBody, Card } from "reactstrap";
import moment from "moment";
moment.locale("pt-br");
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import { connect } from "react-redux";
import useEffectAfterMount from "@src/hooks/useEffectAfterMount";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import {
  FiList,
} from "react-icons/fi";
import { buscarMedicoesRaw, imprimirMedicao } from "@src/redux/actions/financeiro/medicao/index";
import { DiffDatesInDays } from "../../../../../utility/date/date";
import ModalHistoricoMedicao from "../modals/ModalHistoricoMedicao";
import { matchSorter } from "match-sorter";

const MedicoesCanceladas = (props) => {
  const { selectedTipo } = props;

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [filteredData, setFilteredData] = useState([]);
  const [medicao, setMedicao] = useState({});
  const [modal, setModal] = useState(false);

  const buscarMedicoes = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarMedicoesRaw(dataInicial, dataFinal, false, true);
      setLoadingSkeleton(true);
    }
  };

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

  useEffect(() => {
    if (selectedTipo === "Cancelado") {
      buscarMedicoes(intervaloData);
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
              Header: "DATA CANCELAMENTO",
              id: "data_cancelamento",
              accessor: (value) =>
              !value.data_cancelamento
                ? "-"
                : moment(value.data_cancelamento).local().format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_cancelamento"] }),
            },
            {
              Header: "MOTIVO CANCELAMENTO",
              id: "motivo_cancelamento",
              accessor: (value) => value.motivo_cancelamento,
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["motivo_cancelamento"] }),
            },
            {
              Header: "DIAS ATÉ O CANC.",
              id: "DiasCobranca",
              accessor: (value) => DiffDatesInDays(moment(value.data_cancelamento), moment(value.data_cobranca)),
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
  };
};

export default connect(mapStateToProps, {
  buscarMedicoesRaw,
  imprimirMedicao
})(MedicoesCanceladas);
