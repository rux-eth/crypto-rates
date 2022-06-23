import { Map as IMap } from 'immutable';
import { initializePairs, Pair } from './pair';
import { RateResponse, Timestamp } from './types';

async function getExchangeRates(query: Array<any>, key?: string): Promise<Array<RateResponse>> {
    let pairs: IMap<number, Pair> = await initializePairs(query);

    await Promise.all(
        pairs
            .valueSeq()
            .filter((pair, index, arr) => arr.indexOf(pair) === index)
            .map(async (pair) => {
                pair = await pair.fetchRates();
            })
    );

    const final: Array<RateResponse> = query.map((val): RateResponse => {
        return <RateResponse>{
            query: val,
            rates: val.timestamp.map((ts: Timestamp) => {
                return { timestamp: ts, rate: pairs.get(val.id)?.getRate(ts) ?? -1 };
            }),
        };
    });
    return final;
}
export { getExchangeRates };
