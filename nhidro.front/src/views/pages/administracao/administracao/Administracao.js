import { 
  Card, 
  CardHeader, 
  CardBody,
  Row,
  Col
} from 'reactstrap'
import {FiUsers, FiHome, FiDollarSign, FiFile, FiTool, FiUserPlus, FiUser, FiTruck, FiPackage, FiAward, FiClipboard } from 'react-icons/fi'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { WrapperButtonBlue } from '../../../styled-components/GlobalStyles'
import { useHistory } from "react-router-dom"
const Administracao = () => {

  const history = useHistory()

  const toLink = (path) => {
    history.push(path)
  }

  return (
    <Card>
      <CardBody>
        <CardHeader>
          <h5>Painel Administrativo: <a href={`${process.env.REACT_APP_BACKEND_URL}admin`} target="_blank" rel="noopener noreferrer">Clique aqui</a></h5>
        </CardHeader>
        <Row className="mt-3 mb-3 d-flex justify-content-left">
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-acessorios")}
              >
                  <FiTool fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Acessórios
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-cargos")}
              >
                  <FiAward fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Cargos
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-centro-custo")}
              >
                  <FiDollarSign fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Centro Custo
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-clientes")}
              >
                  <FiUsers fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Clientes
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-empresas")}
              >
                  <FiHome fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Empresas
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-equipamentos")}
              >
                  <FiTool fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Equipamentos
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-fornecedores")}
              >
                  <FiPackage fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                  Fornecedores
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-funcionarios")}
              >
                  <HiOutlineUserGroup fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                  Funcionários
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-naturezas")}
              >
                  <FiFile fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Naturezas Contábeis
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-responsabilidades")}
              >
                  <FiClipboard fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Responsabilidades
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-usuarios")}
              >
                  <FiUser fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Usuários
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
                onClick={ () => toLink("/administracao-veiculos")}
              >
                  <FiTruck fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Veículos
                  </div>
              </WrapperButtonBlue>
          </Col>
          {/* <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
              >
                  <FiUsers fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                   Funcionários
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
              >
                  <FiLock fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Nível de acesso
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
              <WrapperButtonBlue
                className="text-center"
              >
                  <HiOutlineCog fontSize="50px" className="mb-1"  style={{display: 'inline-block'}}/>
                  <div>
                    Serviços
                  </div>
              </WrapperButtonBlue>
          </Col>
          <Col className="mb-3 d-flex justify-content-center" xs="12" md="4" lg="3" sm="6">
             
          </Col> */}
        </Row>
      </CardBody>
     
    </Card>
  )
}

export default Administracao
