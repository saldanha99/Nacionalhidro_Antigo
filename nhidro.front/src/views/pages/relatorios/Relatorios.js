import { 
  Card,
  CardBody,
  Row,
  Col 
} from 'reactstrap'
import { FiDollarSign, FiFolderMinus, FiFolderPlus, FiSettings, FiShoppingBag, FiSliders, FiTool} from 'react-icons/fi'
import { HiOutlineCog, HiAdjustments, HiOutlineDocumentText } from 'react-icons/hi'
import { WrapperButtonBlue } from '../../styled-components/GlobalStyles'
import { useHistory  } from "react-router-dom"

const Relatorios = () => {

  const history = useHistory()
  
  const to = (path) => {
    history.push(path)
  }

  return (
    <Card>
      <CardBody>
        <Row className="mt-3 mb-3 d-flex justify-content-center">
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-proposta") }
            >
              <HiOutlineDocumentText fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Propostas
              </div>
            </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-ordem") }
            >
              <FiTool fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Ordem de serviço
              </div>
            </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-escala") }
            >
              <FiSliders fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Escalas
              </div>
            </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-contas-a-pagar") }
            >
              <FiFolderMinus fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Contas a pagar
              </div>
            </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-medicao") }
            >
              <HiAdjustments fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Medição
              </div>
            </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-faturamento") }
            >
              <FiShoppingBag fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Faturamento
              </div>
            </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-contas-a-receber") }
            >
              <FiFolderPlus fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Contas a receber
              </div>
            </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" md="3">
            <WrapperButtonBlue
              className="text-center"
              onClick={ () => to("/relatorio-gestao") }
            >
              <FiSettings fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
              <div>
                Gestão
              </div>
            </WrapperButtonBlue>
          </Col>
        </Row>
      </CardBody>
     
    </Card>
  )
}

export default Relatorios
