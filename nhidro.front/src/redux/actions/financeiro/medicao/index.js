import api from "@src/services/api";
import qs from "qs";
import { normalize } from "../../../../utility/Utils";
import { Enum_StatusMedicao } from "../../../../utility/enum/Enums";

export const cadastrarMedicao = (model) => {
  return (dispatch) => {
    api.post("/api/medicoes/cadastrar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_SALVAR",
          payload: model,
        });
      } else {
        dispatch({
          type: "MEDICAO_SALVAR_ERROR",
          payload: data.error,
        });
      }
    });
  };
};

export const alterarStatusMedicao = (model) => {
  return (dispatch) => {
    api.put(`api/medicoes/${model.data.id}`, model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_SALVAR",
          payload: model
        })
      } else {
        dispatch({
          type: "MEDICAO_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}

export const buscarPrecificacao = (data1, data2) => {
  return (dispatch) => {
    api.post("/api/medicoes/buscar-precificacao", {params: {Data1: data1, Data2: data2}}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_PRECIFICACAO",
          payload: data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_FATURAMENTO_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarOrdemPrecificacao = (id) => {
  const query = qs.stringify(
    {
      populate: ['Servicos.ServicosHorasAdicionais', 'Cliente', 'Contato', 'CriadoPor', 'Equipamento', 'Empresa', 'Proposta']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/ordem-servicos/${id}?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ORDEM_PRECIFICACAO",
          payload: normalize(data)
        })
      }
    })
  }
}

export const buscarMedicoes = (data1, data2) => {
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
              $notIn: [
                Enum_StatusMedicao.Aprovada,
                Enum_StatusMedicao.Cancelado,
                Enum_StatusMedicao.Reprovada
              ],
            },
          },
        ],
      },
      populate: [
        "Empresa",
        "Cliente",
        "Contato",
        "Ordens.Equipamento",
        "Ordens.Contato",
        "Ordens.Cliente",
        "Ordens.Servicos"
      ],
    },
    {
      encodeValuesOnly: true, // prettify url
    }
  );

  return (dispatch) => {
    api.get(`api/medicoes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_MEDICOES",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_MEDICOES_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarMedicoesRaw = (data1, data2, executada, cancelada) => {
  return (dispatch) => {
    api.post(`api/medicoes/buscar`, {params: { Data1: data1, Data2: data2, Executada: executada, Cancelada: cancelada }}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_MEDICOES",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_MEDICOES_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarMedicoesPorCliente = (cliente_id) => {
  return (dispatch) => {
    api.post(`api/medicoes/buscar-por-cliente`, {params: { cliente_id }}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_MEDICOES_CLIENTE",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_MEDICOES_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarMedicao = (id) => {
  const query = qs.stringify(
    {
      populate: [
        "Empresa",
        "Cliente",
        "Contato",
        "Ordens.Equipamento",
        "Ordens.Contato",
        "Ordens.Cliente",
        "Ordens.Servicos"
      ]
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/medicoes/${id}?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_MEDICAO",
          payload: normalize(data)
        })
      }
    })
  }
}

export const buscarMedicoesPorStatus = (data1, data2, status) => {
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
            Status: status
          },
        ],
      },
      populate: [
        "Empresa",
        "Cliente",
        "Contato",
        "Ordens"
      ],
    },
    {
      encodeValuesOnly: true, // prettify url
    }
  );

  return (dispatch) => {
    api.get(`api/medicoes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_MEDICOES_STATUS",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_MEDICOES_STATUS_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const cancelarMedicao = (model) => {
  return (dispatch) => {
    api.post(`/api/medicoes/cancelar`, model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "MEDICAO_CANCELAR",
            payload: data,
          });
        }
      } else {
        dispatch({
          type: "MEDICAO_CANCELAR_ERROR",
          payload: data,
        });
      }
    });
  };
};
          
export const imprimirMedicao = (medicao) => {
  return (dispatch) => {
    api.post("/api/medicoes/imprimir", medicao, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "IMPRIMIR_MEDICAO",
          payload: data
        })
      }
    })
  }
}

export const alterarMedicao = (model) => {
  return (dispatch) => {
    api.post(`api/medicoes/alterar`, model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "MEDICAO_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}
          
export const enviarMedicao = (medicao) => {
  return (dispatch) => {
    api.post("/api/medicoes/enviar", medicao, function (status, data) {
      if (status === 200 && !data.error) {
        dispatch({
          type: "ENVIAR_MEDICAO",
          payload: data
        })
      } else {
        dispatch({
          type: "ENVIAR_MEDICAO_ERROR",
          payload: data
        })
      }
    })
  }
}
          
export const reprovarMedicao = (medicao) => {
  return (dispatch) => {
    api.post("/api/medicoes/reprovar", medicao, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "MEDICAO_SALVAR_ERROR",
          payload: data
        })
      }
    })
  }
}
          
export const aprovarMedicao = (model) => {
  return (dispatch) => {
    api.post("/api/medicoes/aprovar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "MEDICAO_SALVAR_ERROR",
          payload: data
        })
      }
    })
  }
}
          
export const corrigirPrecificacao = (model) => {
  return (dispatch) => {
    api.put(`/api/ordem-servicos/${model.id}`, {data: model}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_PRECIFICAR",
          payload: data
        })
      } else {
        dispatch({
          type: "MEDICAO_PRECIFICAR_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarMedicoesRelatorio = (data1, data2) => {
  return (dispatch) => {
    api.post(`api/medicoes/buscar-relatorio`, {params: { Data1: data1, Data2: data2 }}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_MEDICOES_RELATORIO",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_MEDICOES_ERROR",
          payload: data,
        });
      }
    });
  };
};
