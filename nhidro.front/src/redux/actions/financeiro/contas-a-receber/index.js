import api from "@src/services/api";
import qs from "qs";
import { normalize } from "../../../../utility/Utils";

export const buscarContaReceber = (id) => {
  const query = qs.stringify(
    {
      populate: [
        "Empresa.EmpresaBanco",
        "Cliente",
        "Faturamento.EmpresaBanco",
        "ContaCentrosCustos.CentroCusto",
        "ContaNaturezasContabeis.NaturezaContabil",
        "ContaRecebimento.ContaRecebimentoParcela"
      ]
    },
    {
      encodeValuesOnly: true, // prettify url
    }
  );

  return (dispatch) => {
    api.get(`api/contas-receber/${id}?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONTAS_RECEBER_ID",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_RECEBER_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarContasReceberRaw = (data1, data2, cancelado) => {
  return (dispatch) => {
    api.post(`api/contas-receber/buscar`, { params: { Data1: data1, Data2: data2, Cancelado: cancelado } }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_CONTAS_RECEBER",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_RECEBER_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const adicionarContaReceber = (model) => {
  return (dispatch) => {
    api.post("/api/contas-receber/adicionar", model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "CONTAS_RECEBER_SALVAR",
            payload: data
          })
        } else {
          dispatch({
            type: "CONTAS_RECEBER_SALVAR_ERROR",
            payload: data
          })
        }
      } else {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR_ERROR",
          payload: data
        })
      }
    })
  }
}

export const alterarContaReceber = (model) => {
  return (dispatch) => {
    api.post(`/api/contas-receber/alterar`, model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "CONTAS_RECEBER_SALVAR",
            payload: data
          })
        } else {
          dispatch({
            type: "CONTAS_RECEBER_SALVAR_ERROR",
            payload: data
          })
        }
      } else {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR_ERROR",
          payload: data
        })
      }
    })
  }
}

export const cancelarContaReceber = (model) => {
  return (dispatch) => {
    api.put(`/api/contas-receber/${model.id}`, { data: model }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR",
          payload: data
        });
      } else {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR_ERROR",
          payload: data
        });
      }
    });
  };
};

export const enviarContaReceber = (model) => {
  return (dispatch) => {
    api.put(`/api/contas-receber/${model.id}`, { data: model }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR",
          payload: data
        });
      } else {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR_ERROR",
          payload: data
        });
      }
    });
  };
}

export const buscarParcelas = (data1, data2, recebido) => {
  return (dispatch) => {
    api.post(`api/contas-receber/buscar-parcelas`, { params: { Data1: data1, Data2: data2, Recebido: recebido } }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_PARCELAS",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "BUSCAR_PARCELAS_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarParcelaReceber = (id) => {
  return (dispatch) => {
    api.get(`api/conta-recebimento-parcelas/${id}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_PARCELA_RECEBER",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_PARCELAS_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarParcelaRecebida = (id) => {
  const query = qs.stringify(
    {
      populate: [
        "ParcelasRecebimento.EmpresaBanco"
      ]
    },
    {
      encodeValuesOnly: true, // prettify url
    }
  );
  return (dispatch) => {
    api.get(`api/conta-recebimento-parcelas/${id}?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_PARCELA_RECEBIDA",
          payload: normalize(data),
        });
      } else {
        dispatch({
          type: "BUSCAR_PARCELAS_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const salvarParcela = (model) => {
  return (dispatch) => {
    api.put(`/api/conta-recebimento-parcelas/${model.id}`, { data: model }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "CONTAS_A_RECEBER_SALVAR_PARCELA",
          payload: data,
        });
      } else {
        dispatch({
          type: "BUSCAR_PARCELAS_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const receberConta = (model) => {
  return (dispatch) => {
    api.post(`api/contas-receber/receber`, model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "CONTAS_A_RECEBER_SALVAR_PARCELA",
          payload: data,
        });
      } else {
        dispatch({
          type: "BUSCAR_PARCELAS_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const corrigirConta = (model) => {
  return (dispatch) => {
    api.put(`/api/contas-receber/${model.id}`, { data: model }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR",
          payload: data
        });
      } else {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR_ERROR",
          payload: data
        });
      }
    });
  }
}

export const buscarContasReceberPorCliente = (cliente_id) => {
  return (dispatch) => {
    api.post(`api/contas-receber/buscar-por-cliente`, { params: { cliente_id } }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_CONTAS_RECEBER_CLIENTE",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const buscarContasReceberRelatorio = (data1, data2, relatorio) => {
  return (dispatch) => {
    api.post(`api/contas-receber/buscar-relatorio`, { params: { Data1: data1, Data2: data2, relatorio } }, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_CONTAS_RECEBER_RELATORIO",
          payload: data.data,
        });
      } else {
        dispatch({
          type: "CONTAS_RECEBER_SALVAR_ERROR",
          payload: data,
        });
      }
    });
  };
};

export const validarNotaReceber = (numero, empresaId, tipo) => {
  return (dispatch) => {
    api.get(`api/contas-receber/validar-nota/${numero}/${empresaId}/${tipo}`, function (data) {
      if (data) {
        dispatch({
          type: "VALIDAR_NOTA_RECEBER",
          payload: data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_RECEBER_ERROR",
          payload: data
        })
      }
    })
  }
}