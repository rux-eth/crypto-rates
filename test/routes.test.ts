// @ts-nocheck
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import testRequest from '../utils/testRequest';

describe('index', () => {
    it('/rates', async () => {
        const rates = testRequest;
        const query: any = {
            ratesQuery: rates,
        };
        const res: AxiosResponse = await axios({
            url: 'http://localhost:3000/rates',
            method: 'post',
            data: query,
        });
        fs.writeFile('./test/out/response_data2.json', JSON.stringify(res.data, null, 3), (err) => {
            if (err) throw err;
        });
    });
});
