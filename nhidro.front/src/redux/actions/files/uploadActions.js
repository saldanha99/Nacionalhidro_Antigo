import api from "@src/services/api"

export const upload = (file, filename, type) => {
  const buffer = Buffer.from(file)

  const model = {
    buffer,
    filename,
    type
  }
  
  return (dispatch) => {
    api.post('/api/configuracoes/upload', model, function (status, data) {
      if (status === 200) {
        dispatch({ type: "UPLOAD_FILE", data })
      } else {
        dispatch({
          type: "FILE_ERROR",
          payload:  data
        })
      } 
    })
  }
}
