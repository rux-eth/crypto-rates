"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iChainMapping = exports.chainMapping = exports.baseCurrencies = exports.coinGeckoBaseUrl = void 0;
const immutable_1 = require("immutable");
exports.coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3/';
exports.baseCurrencies = ['usd'];
exports.chainMapping = {
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
exports.iChainMapping = (0, immutable_1.Map)(exports.chainMapping);
