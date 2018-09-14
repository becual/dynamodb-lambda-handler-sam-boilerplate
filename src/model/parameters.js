const AWS = require('aws-sdk');

const awsConfig = 'dev' === process.env.STAGE
    ? {
        region: 'us-east-1',
        endpoint: 'http://111.10.0.1:8000' // docker network
    }
    : {
        region: 'us-east-1'
    };

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getItem = (partitionKey, sortKey) => {

    const params = {
        TableName: process.env.DYNAMODB_PARAMS_TABLE,
        ExpressionAttributeNames: {
            '#parameterType': 'parameterType',
            '#searchIndex': 'searchIndex'
        },
        ExpressionAttributeValues: {
            ':p': partitionKey,
            ':s': sortKey
        },
        KeyConditionExpression: '#parameterType = :p and #searchIndex = :s'
    };

    return dynamodb.query(params).promise()
        .then(result => result)
        .catch(err => {
            console.error(`Error trying to access DynamoDB: ${err}`);
            return err;
        });
};

const getPartition = (partitionKey) => {

    const params = {
        TableName: process.env.DYNAMODB_PARAMS_TABLE,
        ExpressionAttributeNames: {
            '#parameterType': 'parameterType'
        },
        ExpressionAttributeValues: {
            ':p': partitionKey
        },
        KeyConditionExpression: '#parameterType = :p'
    };

    return dynamodb.query(params).promise()
        .then(result => result)
        .catch(err => {
            console.error(`Error trying to access DynamoDB: ${err}`);
            return err;
        });
};

const putParams = (data) => {

    const params = {
        RequestItems: {
            [process.env.DYNAMODB_PARAMS_TABLE]: data.map(item => ({
                PutRequest: {
                    Item: item
                }
            }))
        }
    };

    return dynamodb.batchWrite(params).promise()
        .then(result => result)
        .catch(err => {
            console.error(`Error trying to access DynamoDB: ${err}`);
            return err;
        });
};

module.exports = {
    getItem,
    getPartition,
    putParams
};