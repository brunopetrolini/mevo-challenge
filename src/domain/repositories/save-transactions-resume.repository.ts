export type TransactionResume = {
  reason: string;
  fileName: string;
  totalNonProcessed: number;
};

export interface SaveResumeResponse {
  id: string;
}

export abstract class SaveTransactionsResumeRepository {
  abstract saveResume(
    transactionResume: TransactionResume,
  ): Promise<SaveResumeResponse>;
}
