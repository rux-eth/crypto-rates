import axios from 'axios';
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import data from './utils/testRequest';
dotenv.config();
const url =
    (process.env.NODE_ENV ?? 'dev') === 'production'
        ? 'https://rux-crypto-rates.herokuapp.com'
        : 'http://localhost:3000';
(async () => {
    const start = Date.now();
    const res = await axios({
        url: `${url}/rates`,
        method: 'post',
        data: {
            ratesQuery: data,
        },
    });
    const end = Date.now();
    const total = Math.round(((end - start) / 1000) * 100) / 100;
    console.log(`total time: ${total} seconds`);
    console.log(`Average: ${total / data.length} seconds per rate`);

    writeFileSync('./otu.json', JSON.stringify(res.data, null, 3));
})();
