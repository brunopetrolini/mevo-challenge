export type Transaction = {
  id?: string;
  from: string;
  to: string;
  amount: number;
  file: string;
};

export interface SaveManyTransactionsResponse {
  count: number;
}

export abstract class SaveTransactionRepository {
  abstract saveMany(
    transactions: Transaction[],
  ): Promise<SaveManyTransactionsResponse>;
}
