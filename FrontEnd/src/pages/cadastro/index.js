import '../../styless.css';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Cadastro() {
    const [formData, setFormData] = useState({
        description: '',
        date: '',
        amount: ''
    });

    async function addTransaction(novaTransacao) {
        try {
            let result = await axios.post(`http://localhost:8000/insert/transactions`, novaTransacao);
            console.log(result.data.message);
            toast.success("Trasação Cadastrada com Sucesso");
        } catch (erro) {
            console.error('Erro ao adicionar transação:', erro.response.data.message);
            toast.error("ERROR Favor entrar em contato");
        }
    }; 

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "amount") {

            if ((value.startsWith(",")) || (value.startsWith("-,"))) {
                formattedValue = `0,${value.substring(4)}`;
            }
            
            const parts = formattedValue.split(',');
            if (parts[1] && parts[1].length > 2) {
                formattedValue = ``;
            }
        }
        setFormData({
            ...formData,
            [name]: formattedValue
        });
    };


    async function handleSubmit(e) {
        e.preventDefault();
        //parametros 
        const maxDescriptionLength = 50;
        const minimumDate = new Date('1900-01-01');
        const maximumDate = new Date('2100-12-31');


        const { description, date, amount } = formData;
        if (!description || !date || !amount) {
            toast.warning('Por favor, preencha todos os campos.');
            return;
        }
        const selectedDate = new Date(date);

        if (selectedDate < minimumDate || selectedDate > maximumDate) {
            toast.warning('Data inválida.');
            return;
        }

        const descriptionLength = description.trim().length;

        if (descriptionLength > maxDescriptionLength) {
            toast.warning(`A descrição deve ter no máximo ${maxDescriptionLength} caracteres.`);
            return;
        }

        if (!amount.includes(',')) {
            formData.amount = `${amount},00`;

        } else {
            const decimalPart = amount.split(',')[1];
            if (decimalPart.length === 1) {
                formData.amount = amount + '0';

            } else if (decimalPart.length === 0) {
                formData.amount = amount + '00';
            }
        }
        
        try {
            await addTransaction(formData);
            setFormData({
                description: '',
                date: '',
                amount: ''
            });       
         } catch (error) {
            console.error('Erro ao adicionar transação:', error);
            toast.error('Ocorreu um erro ao adicionar a transação. Por favor, tente novamente.');
        }

    };

    return (
        <>
            <Header />
            <h2>Cadastro de transação</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>

                    <label htmlFor="description">Descrição:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Pagamento "
                    ></textarea>

                    <label htmlFor="date">Data:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />

                    <label htmlFor="amount">Valor:</label>
                    <NumericFormat
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        decimalSeparator=","
                        prefix=""
                        allowNegative={true}
                        placeholder="0,00"
                    />

                    <button type="submit">Enviar</button>
                </form>
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
            />        </>
    );
}

export default Cadastro;