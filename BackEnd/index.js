// install:
// npm install express mongodb crypto hex-to-uuid cors concurrently

//Config
const express = require("express");
const app = express();
const port = 8000;
const hexToUuid = require('hex-to-uuid');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

//Connecting to the database
const db = require("./configMongo.js");

app.use(bodyParser.json());

app.use(cors({ origin: ['http://localhost:3000'] }));

app.use(function (err, req, res, next) {

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: "Erro na análise do corpo da solicitação JSON" });
    }
    next();
});

async function main() {

    // API'S
    app.get('/get/transactions', async function (req, res) {

        let saldo = 0;
        const transactions = await db.projeto.find({});

        for (transaction of transactions) {

            saldo += parseFloat(transaction.amount.replace(',', '.'))
        }

        saldo = saldo.toFixed(2).toString().replace('.', ',')

        res.send({ saldo, transactions });
        saldo = 0;
    })

    app.post('/insert/transactions', async function (req, res) {
        try {
            let description = req.body.description
            let date = req.body.date
            let amount = req.body.amount

            if (!description || !date || !amount) {
                return res.status(400)
                    .json({
                        message: `Por favor, forneça todos os campos necessários:`,
                        exemplo: "{description: Pagamento de Boleto Fatura , date: 17/03/2024, amount: 1500,00}"
                    });
            }

            let uuid = description + date + amount + Date.now();
            uuid = generateUuid(uuid);

            result = await insertOne(description, date, amount, uuid)

            if (result.message == "Transação já consta na base") {
                return res.status(400).json({ message: "Transação já consta na base" });
            }

            res.send(result)

        } catch (error) {
            console.error('Erro interno:', error);
            return res.status(500).json({ message: `Internal Error`, });
        }
    })

    app.put('/update/transactions/:uuid', async function (req, res) {
        try {
            let description = req.body.description
            let date = req.body.date
            let amount = req.body.amount
            let uuid = req.params.uuid

            if (!description || !date || !amount) {
                return res.status(400)
                    .json({
                        message: `Por favor, forneça todos os campos necessários:`,
                        exemplo: "{description: Pagamento de Boleto Fatura, date: 17/03/2024, amount: 1500,00}"
                    });
            }

            result = await updateOne(description, date, amount, uuid)

            res.send(result)

        } catch (error) {
            console.error('Erro interno:', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    })

    app.delete('/delete/transactions/:uuid', async function (req, res) {
        try {
            let uuid = req.params.uuid

            result = await deleteOne(uuid)

            res.send(result)

        } catch (error) {
            console.error('Erro interno:', error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    })

    app.listen(port, () => {
        console.log(`Servidor BackEnd rodando na porta ${port}`);
    });

}

//==================funções banco de dados===============================
async function insertOne(description, date, amount, uuid) {
    try {
        let result = await db.projeto.insertOne({
            "description": description,
            "date": date,
            "amount": amount,
            "uuid": uuid
        })

        result = { message: `Transação adicionada com sucesso, Uuid: ${uuid}` };

        console.log(JSON.stringify(result));

        return result

    } catch (error) {

        if (error.errmsg.includes("duplicate key error collection")) {
            error = { message: "Transação já consta na base" };
        }

        console.error('Erro interno banco de dados:', error);
        return error
    }
}

async function updateOne(description, date, amount, uuid) {
    try {
        let result = await db.projeto.updateOne(
            { 'uuid': uuid },
            { $set: { "description": description, "date": date, "amount": amount } })

        if (result.matchedCount == 0) {
            result = { message: `não foi encontrado transação para o uuid: ${uuid}` };
        }
        if ((result.matchedCount == 1) && (result.modifiedCount == 0)) {
            result = { message: `não houve modificação para a transação de uuid: ${uuid}` };
        }
        if (result.modifiedCount == 1) {
            result = { message: `transação de uuid: ${uuid} alterada com sucesso` };
        }

        console.log(JSON.stringify(result));
        return result

    } catch (error) {
        console.error('Erro interno banco de dados:', error);
        return error
    }
}

async function deleteOne(uuid) {
    try {
        let result = await db.projeto.deleteOne({ "uuid": uuid })

        if (result.deletedCount == 0) {
            result = { message: `não foi encontrado transação para o uuid: ${uuid}` };
        }
        if (result.deletedCount == 1) {
            result = { message: `transação de uuid: ${uuid} deletada com sucesso` };
        }

        console.log(JSON.stringify(result));
        return result

    } catch (error) {
        console.error('Erro interno banco de dados:', error);
        return error
    }
}

//Function to generate unique key
function generateUuid(input) {
    var md5Bytes = crypto.createHash('md5').update(input).digest()
    md5Bytes[6] &= 0x0f; // clear version
    md5Bytes[6] |= 0x30; // set to version 3
    md5Bytes[8] &= 0x3f; // clear variant
    md5Bytes[8] |= 0x80; // set to IETF variant
    return hexToUuid(md5Bytes.toString('hex'))
}

main()