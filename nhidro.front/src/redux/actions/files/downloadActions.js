import api from "@src/services/api"

export const download = (payload) => {
  return (dispatch) => {
    api.postUntype(`/api/configuracoes/download`, payload, "blob", function (status, data) {
      dispatch({
        type: status === 200 ? "DOWNLOAD_FILE" : "FILE_ERROR",
        data: data ?? status,
        fileName: payload.fileName,
      });
    });
  };
};