const initialState = {
    fileId: 0,
    send: false,
    upload: false,
    error: false
} 
  
const FileReducer = (state = initialState, action) => {
    switch (action.type) {
    case "UPLOAD_FILE": {
        return { ...state, fileId: action.data.url, upload: !initialState.upload }
    }
    case "FILE_ERROR": {
        return { ...state, error: true }
    }
    case "SEND_FILE": {
        return { ...state, send: !initialState.send }
    }
    case "SEND_FILE_ERROR": {
        return { ...state, error: true }
    }
    case "DOWNLOAD_FILE":
      return {
        ...state,
        newFile: new Date(),
        file: { name: action.fileName, data: action.data },
    };
    case "CELAR_FILE": {
      return { ...state, fileId: null }
    }
    default: {
        return state
    }
    }
}

export default FileReducer