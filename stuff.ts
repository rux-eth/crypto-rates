import axios from 'axios';
import { coinGeckoBaseUrl } from './src/util/constants';

(async () => {
    const res = await axios({
        url: `${coinGeckoBaseUrl}coins/list?include_platform=true`,
        method: 'get',
    });
    console.log(res.data);
})();
