import { TransactionType } from '../constants/transaction-types';

export interface Transaction {
    id?: string;
    description: string;
    amount: number;
    date: Date;
    category?: string;
    type: TransactionType;
}
