import axios from 'axios';
import { writeFileSync } from 'fs';
import data from './utils/testRequest';
(async () => {
    const res = await axios({
        url: 'https://rux-crypto-rates.herokuapp.com/rates',
        method: 'post',
        data: {
            ratesQuery: data,
        },
    });
    writeFileSync('./otu.json', JSON.stringify(res.data, null, 3));
})();
