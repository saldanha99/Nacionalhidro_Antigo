import FileSaver from "file-saver"

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = window.atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, {type: contentType})
  return blob
}

const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}

export const formatImage = (text) => {
  text = text.replace('<p>', '').replace('</p>', '')
  let imagestring = text.replace('<img src="data:', '').replace('">', '').replace('base64,', '')
  imagestring = imagestring.replace('">', '').replace('base64,', '')

  const array = imagestring.split(';')

  return {
    buffer: base64ToArrayBuffer(array[1]),
    type: array[0]
  }
}

export const downloadURI = (uri, name) => {
  fetch(uri).then((response) => {
    response.blob().then((blob) => {
      const FileSaver = require('file-saver')
      FileSaver.saveAs(blob, name)
    })
  })
}