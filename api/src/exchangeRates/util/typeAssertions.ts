import mongoClient from '../database';
import { ITicker, RateQuery } from '../types';
import { chainMapping, iChainMapping } from './constants';
import { toBasePair } from './dataHelpers';

let ticks: Promise<ITicker> = mongoClient().getTickers();

export async function validateRateQuery(o: any): Promise<{
    valid: boolean;
    rateQuery?: RateQuery;
}> {
    const tickers: ITicker = await ticks;
    const toRateQuery = (): RateQuery => {
        return {
            ...toBasePair(o),
            id: o.id,
            timestamp: o.timestamp,
        };
    };
    if (o?.baseCurrency && o?.id && o?.timestamp && (o?.chain || o?.symbol)) {
        if (o?.chain && o.chain in chainMapping && (o?.address || !o?.symbol)) {
            return { valid: true, rateQuery: toRateQuery() };
        }
        if (o?.symbol) {
            o.symbol = (<string>o.symbol).toLowerCase();
            const chain: string | undefined = iChainMapping.findKey(
                (val) => val.symbol === o.symbol
            );
            if (chain) {
                o.chain = chain;
                return { valid: true, rateQuery: toRateQuery() };
            }
            const chains = tickers.get(o.symbol);
            if (!chains) return { valid: false };
            o.chain = o?.chain && o.chain in chains ? o.chain : Object.keys(chains)[0];
            o.address = chains[o.chain];
            return { valid: true, rateQuery: toRateQuery() };
        }

        return { valid: false };
    }
    return { valid: false };
}
