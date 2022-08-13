import axios, { AxiosResponse } from 'axios';
import { Promise } from 'bluebird';
import cliProgress from 'cli-progress';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as fs from 'fs';
import { Map as IMap } from 'immutable';
import { TransactionResponse } from 'moralis/node_modules/@ethersproject/providers';
import { Chain } from '../src/chains/types';
import { endpoints, supportedChains } from '../src/chains/utils/constants';
const rateLimit = require('axios-rate-limit');
const LogsDecoder = require('logs-decoder');
const logsDecoder = LogsDecoder.create();
dotenv.config();
const rateLimiters: { [key in Chain]: any } = <{ [key in Chain]: any }>(
    Object.fromEntries(
        supportedChains.map((chain: Chain): [Chain, any] => [
            chain,
            rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1100 }),
        ])
    )
);
const chain: Chain = 'eth';
const testAddresses = {
    eth: '0x599ED2119EFC6b97d23729E0f2aF5Bf71c1e1249',
    bsc: '0x4ed0DbE88c6cF8f4d014E6EF10614513795A5629',
    polygon: '0xaBF9b26fC7e0f53C3b47cBE72501Fa5e7aA1993F',
    avalanche: '0x4A1E2BA4a0C7b6b3751ED8AAe750F9314B94c90A',
};
async function optimized(chain: Chain): Promise<Map<string, ethers.providers.TransactionReceipt>> {
    const hash2Req: Map<string, Promise<ethers.providers.TransactionReceipt>> = new Map();
    const nodes: ethers.providers.JsonRpcBatchProvider[] = endpoints[chain].nodes.map(
        (node) => new ethers.providers.JsonRpcBatchProvider(node, endpoints[chain].chainId)
    );
    const allTxns: string[] = await getTransactions(chain);
    allTxns.slice(0, 500).forEach((hash) => {
        hash2Req.set(hash, Promise.any(nodes.map((node) => node.getTransactionReceipt(hash))));
    });
    const hash2Rec: Map<string, ethers.providers.TransactionReceipt> = await Promise.props(
        hash2Req
    );
    return hash2Rec;
}
const start = Date.now();
optimized('avalanche').then((res: Map<string, ethers.providers.TransactionReceipt>) => {
    console.log(res.size);
    console.log((Date.now() - start) / 1000);
});
async function main2(address: string, chain: Chain) {
    let totalTimes: IMap<
        Chain,
        IMap<string, { nTimes: number; total: number; fails: number; errors: number }>
    > = IMap();

    for (let i = 0; i < 10; i++) {
        const bar1 = multibar.create(Object.keys(endpoints).length, 0);

        let temp: Map<
            Chain,
            Promise<IMap<string, { fails: number; time?: number; err?: any }>>
        > = new Map();
        (<Chain[]>Object.keys(endpoints)).forEach((chain: Chain, _, arr) => {
            temp.set(
                chain,
                testNodes(chain)
                    .then((res) => {
                        bar1.increment();
                        return res;
                    })
                    .catch((err) => {
                        throw err;
                    })
            );
        });
        let temp2: IMap<Chain, IMap<string, { fails: number; time?: number; err?: any }>> = IMap(
            await Promise.props(temp)
        );
        fs.writeFile(
            `./test/out/chain_report${i}.json`,
            JSON.stringify(temp2.toJS(), null, 3),
            (err) => {
                if (err) throw err;
            }
        );
        temp2.forEach((v, k) => {
            v.forEach((val, key) => {
                const prevTimes: { nTimes: number; total: number; fails: number; errors: number } =
                    <{ nTimes: number; total: number; fails: number; errors: number }>(
                        totalTimes.getIn([k, key], { nTimes: 0, total: 0, fails: 0, errors: 0 })
                    );
                if (!val || val.err) {
                    const newTimes = {
                        nTimes: prevTimes.nTimes,
                        total: prevTimes.total,
                        fails: prevTimes.fails + val.fails,
                        errors: prevTimes.errors + 1,
                    };
                    totalTimes = totalTimes.setIn([k, key], newTimes);
                } else {
                    const newTimes = {
                        nTimes: prevTimes.nTimes + 1,
                        total: prevTimes.total + val.time,
                        fails: prevTimes.fails + val.fails,
                        errors: prevTimes.errors,
                    };
                    totalTimes = totalTimes.setIn([k, key], newTimes);
                }
            });
        });
    }
    let final = totalTimes.map(
        (val: IMap<string, { nTimes: number; total: number; fails: number; errors: number }>) => {
            return val.map(
                (v: {
                    nTimes: number;
                    total: number;
                    fails: number;
                    errors: number;
                }): { average: number; fails: number; errors: number } => {
                    return {
                        average: Math.round((v.total / v.nTimes) * 100) / 100,
                        fails: v.fails,
                        errors: v.errors,
                    };
                }
            );
        }
    );
    return final.toJS();
}

async function testMoralis(chain: Chain): Promise<number> {
    const node = new ethers.providers.JsonRpcBatchProvider(
        endpoints[chain].nodes[0],
        endpoints[chain].chainId
    );
    const allTxns = await getTransactions(chain);

    let requests = [];
    const start = Date.now();

    for (let i = 0; i < 500; i++) {
        requests.push(node.getTransactionReceipt(allTxns[i]));
    }
    const responses = await Promise.all(requests);
    responses.filter((res) => res);
    console.log(responses);
    console.log(`Errors: ${500 - responses.length}`);
    return (Date.now() - start) / 1000;
}
/* testMoralis('bsc').then((res) => {
    console.log('finished');
    console.log(`total: ${res}`);
}); */

const multibar = new cliProgress.MultiBar({}, cliProgress.Presets.shades_grey);

async function getTransactions(chain: Chain): Promise<string[]> {
    return (<TransactionResponse[]>(
        (<AxiosResponse>(
            await rateLimiters[chain].get(
                `${endpoints[chain].scanner}?module=account&action=txlist&address=${testAddresses[chain]}&startblock=0&endblock=99999999sort=asc&apikey=${endpoints[chain].apiKey}`
            )
        )).data.result
    )).map((val: TransactionResponse): string => {
        return val.hash;
    });
}
async function testNodes(
    chain: Chain
): Promise<IMap<string, { fails: number; time?: number; err?: any }>> {
    const bar2 = multibar.create(endpoints[chain].nodes.length, 0);
    const numTxs = 100;
    const allTxns: string[] = await getTransactions(chain);
    return IMap(
        await Promise.all(
            endpoints[chain].nodes.map(
                async (node): Promise<[string, { fails: number; time?: number; err?: any }]> => {
                    const web3 = new ethers.providers.JsonRpcBatchProvider(
                        node,
                        endpoints[chain].chainId
                    );
                    const start: number = Date.now();
                    let txRecs;
                    try {
                        txRecs = await Promise.all(
                            allTxns.slice(0, numTxs).map((tx) => web3.getTransactionReceipt(tx))
                        );
                    } catch (err) {
                        return [node, { fails: numTxs, err: err }];
                    }

                    const totalTime: number = (Date.now() - start) / 1000;
                    bar2.increment();
                    if (!txRecs) {
                        return [node, { fails: numTxs, time: totalTime }];
                    }
                    let total = 0;
                    txRecs.forEach((rec) => {
                        if (!rec) total += 1;
                    });
                    return [node, { fails: total, time: totalTime }];
                }
            )
        )
    );
}
