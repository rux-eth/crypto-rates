"use strict";
/* import { Promise } from 'bluebird';
import { List, Map as IMap } from 'immutable';
import mongoClient from '../database';
import { BasePair, TimestampTuple } from '../types';
import { findRate, formatTimestamps } from '../util/dataHelpers';
import { marketChart } from './marketChart';

export async function getGCRates(
    query: BasePair,
    ts: List<TimestampTuple>,
    key?: string
): Promise<List<TimestampTuple>> {
    return <IBasePairWithRate>IMap(
        await Promise.all(
            query.entrySeq().map(async (val): Promise<[IBasePair, IRate]> => {
                const tuples: List<TimestampTuple> = await marketChart(
                    val[0],
                    formatTimestamps(val[1]),
                    key
                );
                //console.log(tuples);
                mongoClient().updateRates(val[0], tuples);
                return [val[0], findRate(query.get(val[0]), tuples)];
            })
        )
    );
}
 */
