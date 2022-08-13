import { List } from 'immutable';
import { Collection, Db, MongoClient } from 'mongodb';
import { BasePair, TimestampTuple } from '../types';

export async function getDbRates(pair: BasePair, c: MongoClient): Promise<List<TimestampTuple>> {
    const db: Db = c.db('exchange-rates');
    const coll: Collection = db.collection(pair.chain);

    const doc = await coll.findOne({
        address: pair?.address ?? pair.chain,
        baseCurrency: pair.baseCurrency,
    });

    return List(doc?.prices ?? []);
}
