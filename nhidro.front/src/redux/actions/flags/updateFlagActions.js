export const updateFlag = (obj) => {
    return (dispatch) => {
      dispatch({ type: `UPDATE_FLAG`, obj})
    }
}

