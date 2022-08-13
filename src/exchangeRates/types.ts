import { Map as IMap } from 'immutable';
import { baseCurrencies, chainMapping } from './util/constants';

export type Chain = keyof typeof chainMapping;
export type Platform = typeof chainMapping[Chain]['platform'];
export type CoinId = typeof chainMapping[Chain]['coinId'];
export type Symbol = typeof chainMapping[Chain]['symbol'];
export type BaseCurrency = typeof baseCurrencies[number];
export type ContractAddress = string;
export type Timestamp = number;
export type TimestampTuple = [number, number];
export type Ticker = string;

export type RateQuery = BasePair & { id: number; timestamp: Timestamp[]; symbol?: string };
export type RateResponse = {
    query: RateQuery;
    rates: Array<{ rate: number; timestamp: Timestamp }>;
};
export type IBasePair = IMap<keyof BasePair, BasePair[keyof BasePair]>;
export type IRate = IMap<Timestamp, number>;
export type ITicker = IMap<keyof TickerDoc, TickerDoc[keyof TickerDoc]>;
export type ChainMapping = {
    [key in Chain]: {
        platform: Platform;
        coinId: CoinId;
        symbol: Symbol;
    };
};
export type IChainMapping = IMap<keyof typeof chainMapping, typeof chainMapping[Chain]>;

export interface BasePair {
    chain: Chain;
    baseCurrency: BaseCurrency;
    address?: ContractAddress;
}
export interface TickerDoc {
    [symbol: Ticker]: {
        [key: Chain[number]]: ContractAddress;
    };
}

/**
 *
 * Crypto Rates
 *
 * Endpoint: https://rux-crypto-rates.herokuapp.com/rates
 * HTTP Method: POST
 *
 * id: number                           can be anything, as long as they dont repeat
 * timestamp: Array<number>             must be in milliseconds since UNIX epoch
 * chain: Chain
 *      Acceptable values:
 *          - bitcoin
 *          - ethereum
 *          - avalanche
 *          - polygon
 *          - fantom
 *          - solana
 *          - polkadot
 *          - luna
 *          - binance
 * baseCurrency: BaseCurrency           most major currencies supported (USD, GBP, JPY, etc.)
 * address(OPTIONAL): ContractAddress
 * symbol(OPTIONAL): string
 *
 * For tokens hosted on a chain (like Chainlink on Ethereum), you must provide
 * either a contract address or symbol (LINK for Chainlink). However, a contract
 * address is preferable, as the program will try to resolve symbols but it is
 * not guaranteed and queries could come back empty
 *
 */
