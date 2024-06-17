import '../../styless.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer';
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../components/Loading/Loading';

function Inicial() {


  const navigate = useNavigate();

  const handleButtonClick = (transaction) => {
    navigate(`/Editar`, { state: { transaction } });
  }

  const [Transacoes, setTransacoes] = useState([]);
  const [saldoConta, setSaldoConta] = useState(0);
  const [removeLoading, setRemoveLoading] = useState(false)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resposta = await axios.get('http://localhost:8000/get/transactions')
      setTransacoes(resposta.data.transactions);
      setSaldoConta(resposta.data.saldo);
    } catch (erro) {
      console.error('Erro ao buscar dados:', erro);
    }
    setTimeout(() => {
      setRemoveLoading(true)
    }, 3000)
  };

  const deletarTransacao = async (uuid) => {
    try {
      let result = await axios.delete(`http://localhost:8000/delete/transactions/${uuid}`);
      setTransacoes(Transacoes.filter(transacao => transacao.uuid !== uuid));

      fetchData();
      console.log(result.data.message);
      toast.success("Transação Deletada com Sucesso");

    } catch (erro) {
      console.error('Erro ao excluir transação:', JSON.stringify(erro.message));

      toast.error("ERROR Favor entrar em contato");
    }
  };

  return (
    <>
      <Header />
      <div className="list-container">
        <h2>Lista de Transações</h2>
        {!removeLoading ? (
          <Loading />
        ) : (
          Transacoes.length === 0 ? (
            <h1>
              <Link to="/Cadastro">Você Não Possui Transações ainda, Clique Aqui para Cadastrar</Link>
            </h1>
          ) : (
            <>
              <h2>Saldo em Conta: {saldoConta}</h2>
              <ul>
                {Transacoes.map(transacao => (
                  <li key={transacao.uuid}>
                    <div>Descrição: {transacao.description}</div>
                    <div>Data: {new Date(transacao.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                    <div>Valor: R$ {transacao.amount}</div>
                    <button onClick={() => deletarTransacao(transacao.uuid)}>Excluir</button>
                    <button onClick={() => handleButtonClick(transacao)}>Editar</button>
                  </li>
                ))}
              </ul>
            </>
          )
        )}
      </div>

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Inicial;

