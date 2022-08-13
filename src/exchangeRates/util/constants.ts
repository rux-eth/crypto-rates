import { Map as IMap } from 'immutable';
export const coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3/';
export const baseCurrencies = ['usd'] as const;
export const chainMapping = {
    bitcoin: {
        platform: 'bitcoin',
        coinId: 'bitcoin',
        symbol: 'btc',
    },
    ethereum: {
        platform: 'ethereum',
        coinId: 'ethereum',
        symbol: 'eth',
    },
    avalanche: {
        platform: 'avalanche',
        coinId: 'avalanche-2',
        symbol: 'avax',
    },
    polygon: {
        platform: 'polygon-pos',
        coinId: 'matic-network',
        symbol: 'matic',
    },
    fantom: {
        platform: 'fantom',
        coinId: 'fantom',
        symbol: 'ftm',
    },
    solana: {
        platform: 'solana',
        coinId: 'solana',
        symbol: 'sol',
    },
    polkadot: {
        platform: 'polkadot',
        coinId: 'polkadot',
        symbol: 'dot',
    },
    luna: {
        platform: 'terra',
        coinId: 'terra-luna',
        symbol: 'luna',
    },
    binance: {
        platform: 'binance-smart-chain',
        coinId: 'binancecoin',
        symbol: 'bnb',
    },
};
export const iChainMapping = IMap(chainMapping);
