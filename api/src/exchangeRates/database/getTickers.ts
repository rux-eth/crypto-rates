import { List, Map as IMap } from 'immutable';
import { Collection, MongoClient } from 'mongodb';
import { Chain, ContractAddress, ITicker, Ticker } from '../types';

export async function getTickers(c: MongoClient): Promise<ITicker> {
    const coll: Collection = c.db('exchange-rates').collection('tickers');
    return <ITicker>IMap(
        List(await coll.find().toArray())
            .filter((elem) => elem?.symbol && elem?.chains)
            .map((doc) => [<Ticker>doc.symbol, <
                    {
                        [key: Chain[number]]: ContractAddress;
                    }
                >doc.chains])
    );
}
