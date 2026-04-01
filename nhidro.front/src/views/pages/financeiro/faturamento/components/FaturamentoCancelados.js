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
import {FiList} from "react-icons/fi";
import { buscarFaturamentosRaw, buscarFaturamentoPorStatus, imprimirFaturamento } from "../../../../../redux/actions/financeiro/faturamento";
import ModalHistoricoFaturamento from "../modals/ModalHistoricoFaturamento";
import { matchSorter } from "match-sorter";

const FaturamentoCancelados = (props) => {
  const { selectedTipo } = props;

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3));

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem]);
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState(false);
  const [faturamento, setFaturamento] = useState({});

  const buscarFaturamentos = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD");
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD");

      props.buscarFaturamentosRaw(dataInicial, dataFinal, true);
      setLoadingSkeleton(true);
    }
  };

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue);
  };

  const handleClose = () => {
    setModal(false);
  };
   
  useEffect(() => {
    if (selectedTipo === "Cancelado") {
      buscarFaturamentos(intervaloData);
      setLoadingSkeleton(true);
    }
  }, [selectedTipo]);

  useEffectAfterMount(() => {
    setFilteredData(props?.faturamentos);
    setLoadingSkeleton(false);
  }, [props?.faturamentos]);

  useEffectAfterMount(() => {
    buscarFaturamentos(intervaloData);
  }, [intervaloData]);

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
              id: "medicao",
              accessor: (value) =>`${value?.medicao}/${value?.medicao_revisao}`,
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
              accessor: (value) => value?.data_emissao ? moment.utc(value.data_emissao).local().format("DD/MM/YYYY") : '-',
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
              accessor: (value) => value?.data_vencimento ? moment.utc(value.data_vencimento).local().format("DD/MM/YYYY") : '-',
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
            },
            {
              Header: "COBRANÇA ENVIADA",
              id: "data_cobranca",
              accessor: (value) => value?.data_cobranca ? moment.utc(value.data_cobranca).local().format("DD/MM/YYYY") : '-',
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_cobranca"] }),
            },
            {
              Header: "VALOR BRUTO",
              id: "valor_rateado",
              accessor: (value) => 'R$ '+ value?.valor_rateado?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_rateado"] }),
            },
            {
              Header: "ISS",
              id: "valor_iss",
              accessor: (value) => 'R$ '+ (value?.valor_iss || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_iss"] }),
            },
            {
              Header: "INSS",
              id: "valor_inss",
              accessor: (value) => 'R$ '+ (value?.valor_inss || 0)?.toFixed(2),
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
              accessor: (value) => 'R$ '+ (value.valor_liquido || 0)?.toFixed(2),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["valor_liquido"] }),
            },
            {
              Header: "DATA CANCELAMENTO",
              id: "data_cancelamento",
              accessor: (value) => moment.utc(value.data_cancelamento).format("DD/MM/YYYY"),
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["data_cancelamento"] }),
            },
            {
              Header: "MOTIVO CANCELAMENTO",
              id: "motivo_cancelamento",
              accessor: (value) => value?.motivo_cancelamento || '-',
              filterAll: true,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["motivo_cancelamento"] }),
            },
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
          loadingText="Carregando..."
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
        <ModalHistoricoFaturamento modal={modal} handleClose={handleClose} model={faturamento}/>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    faturamentos: state?.faturamento?.faturamentos,
    error: state?.faturamento?.error
  };
};

export default connect(mapStateToProps, {
  buscarFaturamentosRaw,
  buscarFaturamentoPorStatus,
  imprimirFaturamento
})(FaturamentoCancelados)

