const { MongoClient } = require("mongodb")

const projetoFaculClient = new MongoClient("mongodb://localhost:27017/projetoFacul")

const projetoFaculDatabaseInfo = {

    transacoesCollection: "transacoes",
    database: "projetoFacul"
};

class crud {

    /**
 * Query find
 * @param {any} filter - Ex.: { document: 12345678911 }
 */
    async find(filter) {
        await this.client.connect();

        const Result = await this.collection.find(
            filter
        ).toArray();

        await this.client.close();
        return Result;
    };

    /**
* Query findSort
* @param {any} filter - Ex.: { "document": "12345678911" }
* @param {any} sort - Ex.: { _id:1 }
*/
    async findSort(filter, sort) {
        await this.client.connect();

        const Result = await this.collection.find(
            filter
        ).sort(sort).toArray();

        await this.client.close();
        return Result;
    };

    /**
* Query findOne
* @param {any} filter - Ex.: { "document": "12345678911" }
*/
    async findOne(filter) {
        await this.client.connect();

        const Result = await this.collection.findOne(
            filter
        );

        await this.client.close();
        return Result;
    };

    /**
* Query aggregate
* @param {any} filter - Ex.: [ {$match: {"conductorAccount._id" : { $in: [258,66483] }}}, {$sort:{_id:1}} ]
*/
    async aggregate(filter) {
        await this.client.connect();

        const Result = await this.collection.aggregate(
            filter
        ).toArray();

        await this.client.close();
        return Result;
    };

    /**
  * Query UpdateOne
  * @param {any} filter - Ex.: { "document": "12345678911" }
  * @param {any} update - Ex.: {$set: { "automaticDebit": false }}
  */
    async updateOne(filter, update) {
        await this.client.connect();

        const Result = await this.collection.updateOne(
            filter, update
        );

        await this.client.close();
        return Result;
    };

    /**
 * Query updateMany
 * @param {any} filter - Ex.: { "document": "12345678911" }
 * @param {any} update - Ex.: {$set: { "automaticDebit": false }}
 */
    async updateMany(filter, update) {
        await this.client.connect();

        const Result = await this.collection.updateMany(
            filter, update
        );

        await this.client.close();
        return Result;
    };

    /**
* Query deleteOne
* @param {any} filter - Ex.: { "document": "12345678911" }
*/
    async deleteOne(filter) {
        await this.client.connect();

        const Result = await this.collection.deleteOne(
            filter
        );

        await this.client.close();
        return Result;
    };

    /**
* Query deleteMany
* @param {any} filter - Ex.: { "document": "12345678911" }
*/
    async deleteMany(filter) {
        await this.client.connect();

        const Result = await this.collection.deleteMany(
            filter
        );

        await this.client.close();
        return Result;
    };

    /**
* Query insertOne
* @param {any} filter - Ex.: { "uuid":"1111111", "document": "12345678911" }
*/
    async insertOne(filter) {
        await this.client.connect();

        const Result = await this.collection.insertOne(
            filter
        );

        await this.client.close();
        return Result;
    };

    /**
* Query insertMany
* @param {any} filter - Ex.: [{ "uuid":"1111111", "document": "11987654321" }, {"uuid":"222222", "document": "12345678911" }]
*/
    async insertMany(filter) {
        await this.client.connect();

        const Result = await this.collection.insertMany(
            filter
        );

        await this.client.close();
        return Result;
    };

}

class projetoClass extends crud {
    constructor() {
        super();
        this.collection = projetoFaculClient.db(projetoFaculDatabaseInfo.database).collection(projetoFaculDatabaseInfo.transacoesCollection);
        this.client = projetoFaculClient;
    }
}
const projeto = new (projetoClass);

module.exports = {
    projeto
}

