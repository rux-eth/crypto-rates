import { List, Map as IMap } from 'immutable';
import mongoClient from './database';
import { marketChart } from './marketChart';
import {
    BaseCurrency,
    BasePair,
    Chain,
    ContractAddress,
    IBasePair,
    IRate,
    RateQuery,
    Timestamp,
    // eslint-disable-next-line prettier/prettier
    TimestampTuple
} from './types';
import { findRate, formatTimestamps, toBasePair } from './util/dataHelpers';
import { validateRateQuery } from './util/typeAssertions';

class Pair implements BasePair {
    chain: Chain;
    baseCurrency: BaseCurrency;
    address?: ContractAddress;

    key?: string;
    basePair: BasePair;
    timestamp: List<Timestamp> = List([]);
    rates: IRate = IMap();
    constructor(p: BasePair, k?: string) {
        this.basePair = p;
        this.chain = p.chain;
        this.baseCurrency = p.baseCurrency;
        this.address = p.address;
        this.key = k;
    }
    async fetchRates(): Promise<Pair> {
        await this.fetchDbRates();
        if (this.rates.count() !== this.timestamp.count()) await this.fetchCgRates();
        /*         this.rates.forEach((v, k) => {
            console.log(v);
            console.log(k);
        }); */

        return this;
    }
    async fetchDbRates(): Promise<void> {
        this.rates = findRate(this.timestamp, await mongoClient().getDbRates(this.basePair)).filter(
            (val) => val > 0
        );
    }
    async fetchCgRates(): Promise<void> {
        const left: List<Timestamp> = this.timestamp.filterNot((ts) => this.rates.has(ts));
        const formatted: List<TimestampTuple> = formatTimestamps(left);
        const tuples: List<TimestampTuple> = await marketChart(this.basePair, formatted, this.key);
        const newRates: IRate = findRate(left, tuples).filter((val) => val > 0);

        this.rates = this.rates.merge(newRates);
        if (tuples.count() > 0) {
            mongoClient().updateRates(this.basePair, tuples);
        }
    }
    addTimestamps(ts: Timestamp[]): void {
        this.timestamp = this.timestamp.concat(...ts);
    }
    getRate(ts: Timestamp): number {
        return this.rates.get(ts, -1);
    }
}
async function initializePairs(q: Array<any>): Promise<IMap<number, Pair>> {
    let pair2id: List<[number, Pair]> = List([]);
    let ipair2pair: IMap<IBasePair, Pair> = IMap();
    let ids: number[] = [];
    await Promise.all(
        q.map(async (val: any) => {
            if (!val?.id) throw { status: 400, message: `No Request ID Provided` };
            const validated = await validateRateQuery(val);
            if (validated.valid) {
                const rq: RateQuery = validated.rateQuery!;
                if (ids.includes(rq.id))
                    throw { status: 400, message: `Repeating Request ID: ${rq.id}` };
                const basePair: BasePair = toBasePair(rq);
                const pair: Pair = ipair2pair.get(IMap(basePair), new Pair(basePair));
                pair.addTimestamps(rq.timestamp);
                pair2id = pair2id.push([rq.id, pair]);
                ipair2pair = ipair2pair.set(IMap(basePair), pair);
            }
        })
    );
    return IMap(pair2id);
}

export { initializePairs, Pair };
