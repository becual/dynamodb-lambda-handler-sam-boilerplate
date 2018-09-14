import test from 'ava';
import parameters from '../parameters';

test.before('Must insert a Item', async t => {

    const data = [{
        parameterType: 'Antiguedad',
        searchIndex: 365,
        modResult: 30,
        otroValor: 'X'
    }, {
        parameterType: 'Antiguedad',
        searchIndex: 0,
        modResult: 0,
        otroValor: 'XX'
    },    {
        parameterType: 'Protestos y morosidades',
        searchIndex: 123,
        modResult: 321,
        otroValor: 'otro Valor'
    }];

    const insertedItem = await parameters.putParams(data);

    t.deepEqual(insertedItem, { UnprocessedItems: {} });
});

test('Must get data', async t => {

    const segmentationData = await parameters.getItem('Protestos y morosidades', 123);

    const expectedResult = [{
        parameterType: 'Protestos y morosidades',
        searchIndex: 123,
        modResult: 321,
        otroValor: 'otro Valor'
    }];

    t.deepEqual(segmentationData.Items, expectedResult);
});

test('Must get all data from a partition key', async t => {

    const segmentationData = await parameters.getPartition('Antiguedad');

    const expectedResult = [{
        parameterType: 'Antiguedad',
        searchIndex: 0,
        modResult: 0,
        otroValor: 'XX'
    }, {
        parameterType: 'Antiguedad',
        searchIndex: 365,
        modResult: 30,
        otroValor: 'X'
    }];

    t.deepEqual(segmentationData.Items, expectedResult);
});

// error handling test

test.after('Error when get data', async t => {

    process.env.DYNAMODB_PARAMS_TABLE = 231;

    const segmentationData = await parameters.getItem('654987', 984984);

    t.is(segmentationData.code, 'ResourceNotFoundException');
});

test.after('Error when get Partition', async t => {

    process.env.DYNAMODB_PARAMS_TABLE = 231;

    const segmentationData = await parameters.getPartition('654987');

    t.is(segmentationData.code, 'ResourceNotFoundException');
});

test.after('Error when insert a Item', async t => {

    process.env.DYNAMODB_PARAMS_TABLE = 231;

    const data = [{
        parameterType: 'Antiguedad',
        searchIndex: 1,
        modResult: 1,
        otroValor: '1'
    }];

    const insertedItem = await parameters.putParams(data);

    t.is(insertedItem, 'ResourceNotFoundException');
});