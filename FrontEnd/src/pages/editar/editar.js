import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import '../../styless.css';
import { NumericFormat } from 'react-number-format';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Editar() {

    const navigate = useNavigate();
    const location = useLocation();
    const { transaction } = location.state || {};

    const [formEnabled, setFormEnabled] = useState(true);

    async function handleButtonClick() {
        navigate(`/lista`);
    }
    const uuid = transaction.uuid;

    const [formData, setFormData] = useState({
        description: transaction.description,
        date: transaction.date,
        amount: transaction.amount,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "amount") {

            if ((value.startsWith(","))) {
                formattedValue = `0,${value.substring(4)}`;
            }
            if ((value.startsWith("-,"))) {
                formattedValue = `-0,${value.substring(4)}`;
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
        const maxDescriptionLength = 100;
        const minimumDate = new Date('1900-01-01');
        const maximumDate = new Date('2100-12-31');


        const { description, date, amount } = formData;
        if (!description || !date || !amount) {
            toast.warning('Por favor, preencha todos os campos.');
            return;
        }
        const selectedDate = new Date(date);

        if (selectedDate < minimumDate || selectedDate > maximumDate) {
            toast.warning('Data invalida');
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
            setFormEnabled(false);
            await EditTransaction(uuid, formData);
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

    const EditTransaction = async (uuid, formData) => {
        try {
            let result = await axios.put(`http://localhost:8000/update/transactions/${uuid}`, formData);
            await new Promise(resolve => {
                console.log(result.data.message)
                toast.success("Edição Feita com Sucesso", {
                    onClose: () => resolve()
                });
            });
            handleButtonClick();
        } catch (erro) {
            console.error('Erro ao Editar a transação:', erro.response.data.message);
            toast.error("ERROR Favor entrar em contato");

        }

    };

    return (
        <>
            <Header />
            <h2>Edição de transação</h2>

            <div className="form-container">
                <form onSubmit={handleSubmit} disabled={!formEnabled}>

                    <div>
                        <label htmlFor="description">Descrição:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="date">Data:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="amount">Valor:</label>
                        <NumericFormat
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            decimalSeparator=","
                            prefix=""
                            allowNegative={true}
                        />
                    </div>
                    <button type="submit" disabled={!formEnabled}>Salvar</button>
                    <button onClick={handleButtonClick} disabled={!formEnabled}>Voltar</button>
                </form>
            </div>
            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={1000}
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
};

export default Editar;