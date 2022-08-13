// @ts-nocheck
import axios from 'axios';
import * as dotenv from 'dotenv';
import { List } from 'immutable';
import { TickerDoc } from '../src/types';
import { coinGeckoBaseUrl } from '../src/util/constants';
dotenv.config();
describe('Coins', () => {
    it('Coins list', async () => {
        const res = await axios({
            url: `${coinGeckoBaseUrl}coins/list?include_platform=true`,
            method: 'get',
        });

        let coins: List<TickerDoc> = List(
            res.data
                .filter(
                    (coin) =>
                        'id' in coin &&
                        'symbol' in coin &&
                        'name' in coin &&
                        'platforms' in coin &&
                        Object.keys(coin.platforms).length > 0 &&
                        Object.values(coin.platforms)[0] &&
                        (<string>Object.values(coin.platforms)[0]).length > 0
                )
                .map((coin): TickerDoc => {
                    const chain = Object.keys(coin.platforms)[0];
                    return <TickerDoc>{
                        symbol: coin.symbol.toLowerCase(),
                        chains: coin.platforms,
                    };
                })
        );

        coins = coins.filter(
            (val: TickerDoc, index) =>
                coins.findIndex((v: TickerDoc) => v.symbol === val.symbol) === index
        );
    });
});
