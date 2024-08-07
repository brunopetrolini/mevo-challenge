export type TransactionResume = {
  reason: string;
  fileName: string;
  totalNonProcessed: number;
};

export interface SaveResumeResponse {
  id: string;
}

export interface SaveTransactionsResumeRepository {
  saveResume(transactionResume: TransactionResume): Promise<SaveResumeResponse>;
}
