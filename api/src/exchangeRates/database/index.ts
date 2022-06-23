import * as dotenv from 'dotenv';
import { List } from 'immutable';
import { MongoClient } from 'mongodb';
import { BasePair, TimestampTuple } from '../types';
import { getDbRates } from './getDbRates';
import { getTickers } from './getTickers';
import { uploadRates } from './uploadRates';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL!).connect();
export default function mongoClient() {
    const mongo = {
        async getDbRates(pair: BasePair) {
            const c = await client;
            return getDbRates(pair, c);
        },
        async updateRates(pair: BasePair, prices: List<TimestampTuple>) {
            const c = await client;
            return uploadRates(pair, prices, c);
        },
        async getTickers() {
            const c = await client;
            return getTickers(c);
        },
    };
    return mongo;
}
