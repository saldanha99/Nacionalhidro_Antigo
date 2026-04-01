import api from "@src/services/api";
import qs from "qs";
import { normalize } from "../../../../utility/Utils";
import { Enum_StatusFaturamento } from "../../../../utility/enum/Enums";

export const buscarFaturamentos = (data1, data2) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            DataCriacao: {
              $between: [data1, data2],
            },
          },
          {
            Status: {
              $ne: [Enum_StatusFaturamento.Cancelado],
            },
          },
        ],
      },
      populate: [
        "Empresa.EmpresaBanco",
        "Cliente",
        "Medicao.Contato",
        "Medicao.Ordens.Equipamento",
      ],
    },
    {
      encodeValuesOnly: true, // prettify url
    }
  );

  return (dispatch) => {
    api.get(`api/faturamentos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_FATURAMENTO",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarFaturamentosEnviados = (data1, data2, cliente) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          data1 && data2 ? {
            DataCriacao: {
              $between: [data1, data2],
            },
          }: {},
          cliente?.id ? {
            Cliente: {
              id: cliente.id,
            },
          }: {},
          {
            Status: {
              $eq: Enum_StatusFaturamento.Enviado,
            }
          },
          {
            StatusRecebimento: {
              $null: true,
            }
          }
        ]
      },
      populate: [
        "Empresa",
        "Cliente",
        "Contato",
        "Medicao.Ordens.Equipamento.NaturezaContabil",
        "Medicao.Ordens.Escala.EscalaVeiculos.Veiculo"
      ]
    },
    {
      encodeValuesOnly: true // prettify url
    }
  );

  return (dispatch) => {
    api.get(`api/faturamentos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_FATURAMENTO",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarFaturamentosRaw = (data1, data2, cancelado) => {
  return (dispatch) => {
    api.post(`api/faturamentos/buscar`, {params: {Data1: data1, Data2: data2, Cancelado: cancelado}}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_FATURAMENTO",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const alterarFaturamento = (id, data) => {
  return (dispatch) => {
    api.put(`api/faturamentos/${id}`, {data}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "FATURAMENTO_SALVAR",
          payload: data,
        });
      } else {
        dispatch({
          type: "FATURAMENTO_SALVAR_ERROR",
          payload: data.error,
        });
      }
    });
  };
};

export const buscarFaturamentoPorStatus = (data1, data2, status) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            DataCriacao: {
              $between: [data1, data2],
            },
          },
          {
            Status: status,
          },
        ],
      },
      populate: [
        "Medicao.Empresa.EmpresaBanco",
        "Medicao.Cliente",
        "Medicao.Contato",
        "Medicao.Ordens.Equipamento",
      ],
    },
    {
      encodeValuesOnly: true, // prettify url
    }
  );

  return (dispatch) => {
    api.get(`api/faturamentos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_FATURAMENTO_STATUS",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_STATUS_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarFaturamento = (id) => {
  const query = qs.stringify(
    {
      populate: [
        "EmpresaBanco",
        "Empresa.EmpresaBanco",
        "Cliente",
        "Medicao.Ordens.Equipamento",
        "Medicao.Ordens.Contato",
        "Medicao.Contato"
      ]
    },
    {
      encodeValuesOnly: true, // prettify url
    }
  );

  return (dispatch) => {
    api.get(`api/faturamentos/${id}?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ID",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarFaturamentosPorCliente = (cliente_id) => {
  return (dispatch) => {
    api.post(`api/faturamentos/buscar-por-cliente`, {params: { cliente_id }}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_FATURAMENTOS_CLIENTE",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const imprimirFaturamento = (model) => {
  return (dispatch) => {
    api.post("/api/faturamentos/imprimir", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "IMPRIMIR_FATURAMENTO",
          payload: data,
        });
      }
    });
  };
};
       
export const gerarFaturamento = (model) => {
  return (dispatch) => {
    api.post("/api/faturamentos/gerar", model, function (status, data) {
      if (status === 200 && !data.error) {
        dispatch({
          type: "FATURAMENTO_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "FATURAMENTO_SALVAR_ERROR",
          payload: data.data || data
        })
      }
    })
  }
}
       
export const emitirNFS = (model) => {
  return (dispatch) => {
    api.post("/api/faturamentos/emitir-nfs", model, function (status, data) {
      if (status === 200 && !data.error) {
        dispatch({
          type: "NFS_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "NFS_SALVAR_ERROR",
          payload: data.data || data
        })
      }
    })
  }
}
          
export const enviarFaturamento = (model) => {
  return (dispatch) => {
    api.post("/api/faturamentos/enviar", model, function (status, data) {
      if (status === 200 && !data.error) {
        dispatch({
          type: "ENVIAR_FATURAMENTO",
          payload: data,
        });
      } else {
        dispatch({
          type: "ENVIAR_FATURAMENTO_ERROR",
          payload: data,
        });
      }
    });
  };
};
          
export const clonarFaturamento = (model) => {
  return (dispatch) => {
    api.post("/api/faturamentos/clonar", model, function (status, data) {
      if (status === 200 && !data.error) {
        dispatch({
          type: "FATURAMENTO_SALVAR",
          payload: data,
        });
      } else {
        dispatch({
          type: "FATURAMENTO_SALVAR_ERROR",
          payload: data,
        });
      }
    });
  };
};
          
export const cancelarFaturamento = (model) => {
  return (dispatch) => {
    api.post("/api/faturamentos/cancelar", model, function (status, data) {
      if (status === 200 && !data.error) {
        dispatch({
          type: "CANCELAR_FATURAMENTO",
          payload: data.data || data,
        });
      } else {
        dispatch({
          type: "CANCELAR_FATURAMENTO_ERROR",
          payload: data.data || data,
        });
      }
    });
  };
};

export const buscarFaturamentosRelatorio = (data1, data2) => {
  return (dispatch) => {
    api.post(`api/faturamentos/buscar-relatorio`, {params: { Data1: data1, Data2: data2 }}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_FATURAMENTOS_RELATORIO",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ERROR",
          payload: data,
        });
      }
    });
  };
};
