import React, { useEffect, useState } from "react"
import { Button, Card, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import moment from "moment"
import { FiDownload, FiEdit, FiEye, FiX } from "react-icons/fi"
import uuidv4 from 'uuid/v4'
import ModalAdicionarDocumento from "./ModalAdicionarDocumento"
import { DiffDatesInDays } from "../../../../utility/date/date"
moment.locale("pt-br")

const MySwal = withReactContent(Swal)

const mimeTypes = {
  "pdf": "application/pdf",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "html": "text/html",
  "htm": "text/html",
  "txt": "text/plain",
  "json": "application/json",
  "csv": "text/csv",
  "xml": "application/xml"
};

const ModalEmpresaDocumentos = (props) => {
  const {
    modal,
    handleClose,
    empresa,
    loading,
    upload,
    download,
    file,
    fileId,
    cadastrarEmpresaDocumento,
    deletarEmpresaDocumento,
    user
  } = props;
  const [modalArquivo, setModalArquivo] = useState(false);
  const [model, setModel] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [mimeType, setMimeType] = useState(null);

  function getFileNameFromUrl(url) {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts.pop();
  }

  const getFileExtension = (url) => {
    return url.split('.').pop().split(/\#|\?/)[0];
  };

  const getMimeType = (extension) => {
    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  };  

  function downloadFile(url) {
    const filename = getFileNameFromUrl(url);
    const extension = getFileExtension(url);
    const mimeType = getMimeType(extension);
    setMimeType(mimeType);
    setFileName(filename);
    download({
      remoteName: filename,
      fileName: filename,
    })
  }

  const deletar = (data) => {
    MySwal.fire({
      title: `Exclusão de documento`,
      icon: "warning",
      text: "Tem certeza que deseja continuar?",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1",
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true,
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          text: "Motivo da exclusão",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Salvar",
          cancelButtonText: "Cancelar",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-primary mr-1",
          },
          reverseButtons: true,
          preConfirm: (value) => {
            if (value) {
              const model = {... data};
              model.MotivoExclusao = value;
              deletarEmpresaDocumento(model);
            } else {
              Swal.showValidationMessage("O motivo é um campo obrigatório");
            }
          },
          buttonsStyling: false,
          showLoaderOnConfirm: true,
        });
      }
    });
  };

  const columns = [
    {
      Header: "AÇÕES",
      id: "acoes",
      accessor: "acoes",
      filterable: false,
      notExport: true,
      width: 180,
      Cell: (row) => {
        return (
          <div>
            {user.role.name === "Gerencial" && <FiX title="Deletar" style={{ margin: "5px" }} size={20} onClick={() => {
              deletar(row.original)} 
            }
            />}
            <FiDownload
              title="Download"
              style={{ margin: "5px" }}
              size={20}
              onClick={() => {
                downloadFile(row.original.UrlArquivo)
              }}
            />
            <FiEye
              title="Abrir"
              style={{ margin: "5px" }}
              size={20}
              onClick={() => {
                window.open(row.original.UrlArquivo);
              }}
            />
          </div>
        );
      },
    },
    {
      Header: "DESCRIÇÃO",
      id: "Descricao",
      accessor: "Descricao",
      filterAll: true,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["Descricao"] }),
    },
    {
      Header: "DATA VENCIMENTO",
      id: "DataVencimento",
      accessor: row => moment(row.DataVencimento).format('DD/MM/YYYY'),
      filterAll: true,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["DataVencimento"] }),
    },
  ];

  useEffect(() => {
    if (fileId && model) {
      const data = model;
      data.UrlArquivo = props.fileId;
      cadastrarEmpresaDocumento({ data });
      setModel(null);
    }
  }, [fileId]);

  useEffect(() => {
    if (!file?.data || !fileName) return;

    var reader = new FileReader();
    reader.readAsDataURL(file.data);
    reader.onloadend = function () {
      var base64data = reader.result;
      var url = base64data.replace(
        "application/octet-stream",
        mimeType
      );

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch((error) =>
          console.error(
            "There has been a problem with your fetch operation:",
            error
          )
        );
    };
  }, [file]);

  const save = (doc, file) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja adicionar o documento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1",
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true,
    }).then((ok) => {
      if (ok.value) {
        setModalArquivo(false);
        setModel(doc);
        const extension = file.type.split("/")[1];
        const filename = `${uuidv4()}.${extension}`;
        const reader = new FileReader();
        reader.onload = function () {
          const arrayBuffer = this.result;
          upload(arrayBuffer, filename, file.type);
        };

        reader.readAsArrayBuffer(file);
      }
    });
  };

  return (
    <Modal
    isOpen={modal}
    size="xl"
    toggle={() => handleClose()}
    className="modal-dialog-centered"
    backdrop={false}
  >
    <ModalHeader
      toggle={() => handleClose()}
      style={{ background: '#2F4B7433' }}
      cssModule={{ close: 'close button-close' }}
    >
      <h4 className="mt-1 mb-1"><b>Documentos Empresa</b></h4>
    </ModalHeader>
    <ModalBody>
      <Card>
        <ModalAdicionarDocumento
          modal={modalArquivo}
          setModal={setModalArquivo}
          empresa={empresa}
          save={save}
        />
        <Row className="justify-content-between mt-5 mb-5 ml-2 mr-2">
          <Col style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                setModalArquivo(true);
              }}
              color="primary"
            >
              Adicionar
            </Button>
          </Col>
        </Row>
        <ReactTable
          style={{ fontSize: "small", textAlign: "center" }}
          filterable
          pagination
          responsive
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          columns={columns}
          defaultPageSize={10}
          previousText={"Anterior"}
          nextText={"Próximo"}
          noDataText="Não há documentos para exibir"
          pageText="Página"
          ofText="de"
          rowsText="itens"
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
          getTrProps={(state, rowInfo) => {
            if (rowInfo && rowInfo.row) {
              return {
                style: {
                  color: DiffDatesInDays(moment(), moment(rowInfo.original.DataVencimento)) > 0 ? "red" : "black"
                },
              }
            } else {
              return {}
            }
          }}
          data={empresa?.EmpresaDocumentos}
          loading={loading}
        />
      </Card>
    </ModalBody>
  </Modal>
  );
};

export default ModalEmpresaDocumentos