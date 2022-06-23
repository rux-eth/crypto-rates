import { List } from 'immutable';
import { Collection, MongoClient } from 'mongodb';
import { BasePair, TimestampTuple } from '../types';

export async function uploadRates(
    pair: BasePair,
    prices: List<TimestampTuple>,
    c: MongoClient,
    coll: Collection = c.db('exchange-rates').collection(<string>pair.chain)
) {
    const query = {
        address: pair?.address ?? pair.chain,
        chain: pair.chain,
        baseCurrency: pair.baseCurrency,
    };
    const doc = await coll.findOne(query);
    let newTuples: List<TimestampTuple> = List(
        doc && doc.prices ? prices.push(...doc.prices) : prices
    );
    newTuples = newTuples.filter(
        (val, index) => newTuples.findIndex((v) => v[0] === val[0] && v[1] === val[1]) === index
    );
    await coll.updateOne(query, { $set: { prices: newTuples.toJS() } }, { upsert: true });
}
