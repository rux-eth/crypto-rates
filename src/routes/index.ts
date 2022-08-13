import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import * as express from 'express';
// import { getExchangeRates } from '../exchangeRates';
// import { RateResponse } from '../exchangeRates/types';
import asyncHandler from '../util/asyncHandler';
const jsonParser = bodyParser.json();
const router = express.Router();
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Crypto Rates Home Page');
});
router.post(
    '/rates',
    jsonParser,
    asyncHandler(async (req: Request, res: Response, next) => {
        res.send('hi');
        /*         const {ratesQuery, key} = req.body;
        const response: Array<RateResponse> = await getExchangeRates(
            req.body.ratesQuery,
            req.body.key
        );
        // resetQueue(req.body.key);
        //console.log(response);
        res.json(response); */
    })
);

export default router;
