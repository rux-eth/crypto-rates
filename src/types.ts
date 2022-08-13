import { List, Map as IMap } from 'immutable';
import { BaseCurrency, ContractAddress, IBasePair } from './exchangeRates/types';
export * from './exchangeRates/types';
export type RateQueryId = number;
export type Timestamp = number;

export type TimestampTuple = [Timestamp, number];

export type ChainMapping = { [key: string]: { platform: string; coinId: string; symbol: string } };
// export type IChainMapping =
export type Rate = { timestamp: Timestamp; price: number };

export type RateQuery = PairWithTimestamp & { id: number } & { symbol?: string };
export type RateResponse = { id: number } & { query: RateQuery; rates: Array<Rate> };

//export type TickerMapping = IMap<Tick>
//type KeyOf<T extends ChainMapping, S extends string[] = []> =
export interface ExpressError {
    status: number;
    message: string;
}
export interface BasePair {
    chain: Chain;
    baseCurrency: BaseCurrency;
    address?: ContractAddress;
}
export interface PairWithTimestamp extends BasePair {
    timestamp: Array<Timestamp>;
}
export interface PairWithRate extends PairWithTimestamp {
    rates: Array<Rate>;
}
export interface RatesQuery {
    ratesQuery: Array<RateQuery>;
    key?: string;
}
export type RatesResponse = Array<RateResponse>;
// endpoint types
export type IBasePairWithTimestamp = IMap<IBasePair, List<Timestamp>>;
export type IBasePairWithRate = IMap<IBasePair, IRate>;

export type IRate = IMap<Timestamp, number>;

export type IRatesQuery = IMap<keyof (PairWithTimestamp & { id: number }), any>;
export type IRatesResponse = IMap<keyof (PairWithRate & { id: number }), any>;
export type Chain = 'eth' | 'polygon' | 'bsc' | 'avalanche';
export type Endpoints = {
    [key in Chain]: {
        scanner: string;
        apiKey: string;
        nodes: Array<string>;
        chainId: number;
    };
};

export enum TxType {
    TRANSFER,
    CLAIM,
}
