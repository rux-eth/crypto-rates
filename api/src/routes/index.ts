import bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import { getExchangeRates } from '../exchangeRates';
import { RateResponse } from '../exchangeRates/types';
//import { Coin, MarketChartData, NotFoundResponse } from '../exchangeRates/src/types';
import asyncHandler from '../util/asyncHandler';
const createReport = require('../crypto-tax-report');
const jsonParser = bodyParser.json();
const router = express.Router();

router.post('/taxes', jsonParser, (req, res, next) => {
    const taxesReq = req.body;
    const report = createReport({
        config: {
            local_currency: 'USD',
            price_method: 'BASE',
            cost_basis_method: 'FIFO',
            decimal_places: 2,
            allow_lot_overlap: true,
        },
        transactions: taxesReq.transactions,
        prices: taxesReq.prices,
    });
    fs.writeFile('./taxes_report.json', JSON.stringify(report, null, 3), (err) => {
        if (err) throw err;
    });
    res.json(report);
});
router.post(
    '/rates',
    jsonParser,
    asyncHandler(async (req, res, next) => {
        const response: Array<RateResponse> = await getExchangeRates(
            req.body.ratesQuery,
            req.body.key
        );
        // resetQueue(req.body.key);
        //console.log(response);
        res.json(response);
    })
);
router.post(
    '/addresses',
    jsonParser,
    asyncHandler(async (req, res, next) => {})
);

export default router;
