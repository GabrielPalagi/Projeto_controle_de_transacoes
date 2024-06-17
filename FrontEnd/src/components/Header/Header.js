import { Link } from "react-router-dom"
import '../../styless.css';

function header() {

  return (
    <header className="header">
      <nav>
        <Link to="/lista">Lista de Transações</Link>
        <Link to="/Cadastro">Cadastrar Transações</Link>
      </nav>

    </header>
  )
}

export default header