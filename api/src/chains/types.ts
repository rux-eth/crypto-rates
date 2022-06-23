import { supportedChains } from './utils/constants';
export type Chain = typeof supportedChains[number];
export type Endpoints = {
    [key in Chain]: {
        scanner: string;
        apiKey: string;
        nodes: Array<string>;
        chainId: number;
    };
};

export enum TxType {
    TRANSFER,
    CLAIM,
}
