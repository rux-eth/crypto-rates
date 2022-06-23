import * as dotenv from 'dotenv';
import { Endpoints } from '../types';

dotenv.config();
const supportedChains = ['eth', 'polygon', 'bsc', 'avalanche'] as const;
const endpoints: Endpoints = {
    eth: {
        scanner: 'https://api.etherscan.io/api',
        apiKey: <string>process.env.ETHERSCAN_KEY,
        nodes: [
            //'https://main-light.eth.linkpool.io',
            //'https://eth-rpc.gateway.pokt.network',
            'https://api.mycryptoapi.com/eth',
            //'https://ethereumnodelight.app.runonflux.io',
            //'https://rpc.flashbots.net/',
            //'https://rpc.ankr.com/eth',
            'https://mainnet.infura.io/v3/4cfbcecf7e2842f8ac479d409d3dd9b0',
            'https://speedy-nodes-nyc.moralis.io/ae9ee4e417864384d345d558/eth/mainnet',
        ],
        chainId: 1,
    },
    polygon: {
        scanner: 'https://api.polygonscan.com/api',
        apiKey: <string>process.env.POLYGONSCAN_KEY,
        nodes: [
            'https://polygon-rpc.com',
            //'https://rpc-mainnet.maticvigil.com',
            //'https://rpc-mainnet.matic.quiknode.pro',
            //'https://matic-mainnet.chainstacklabs.com',
            //'https://matic-mainnet-full-rpc.bwarelabs.com',
            'https://matic-mainnet-archive-rpc.bwarelabs.com',
            //'https://poly-rpc.gateway.pokt.network/',
            //'https://rpc.ankr.com/polygon',
            'https://speedy-nodes-nyc.moralis.io/ae9ee4e417864384d345d558/polygon/mainnet',
        ],
        chainId: 137,
    },
    bsc: {
        scanner: 'https://api.bscscan.com/api',
        apiKey: <string>process.env.BSCSCAN_KEY,
        nodes: [
            'https://bsc-dataseed.binance.org',
            'https://bsc-dataseed1.defibit.io',
            'https://bsc-dataseed1.ninicoin.io',
            'https://bscrpc.com',
            //'https://rpc.ankr.com/bsc',
            'https://speedy-nodes-nyc.moralis.io/ae9ee4e417864384d345d558/bsc/mainnet',
        ],
        chainId: 56,
    },
    avalanche: {
        scanner: 'https://api.snowtrace.io/api',
        apiKey: <string>process.env.SNOWTRACE_KEY,
        nodes: [
            'https://api.avax.network/ext/bc/C/rpc',
            'https://rpc.ankr.com/avalanche',
            'https://speedy-nodes-nyc.moralis.io/ae9ee4e417864384d345d558/avalanche/mainnet',
        ],
        chainId: 43114,
    },
};
function wrapper(fn: Function) {}
export { supportedChains, endpoints };
