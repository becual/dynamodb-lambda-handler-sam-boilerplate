const parameters = require('./src/model/parameters');

exports.handler = async (event, context, callback) => {

    callback(null, {
        body: `Holiwi ${event.name} -> variable de entorno: ${process.env.DYNAMODB_PARAMS_TABLE}`,
        tableResponse: await parameters.getPartition('Antiguedad')
    });
};