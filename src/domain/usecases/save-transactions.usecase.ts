import { Injectable } from '@nestjs/common';
import { TransactionsResume } from '@prisma/client';
import { SaveTransactionRepository } from '../repositories/save-transaction.repository';
import { SaveTransactionsResumeRepository } from '../repositories/save-transactions-resume.repository';

export type Transaction = {
  from: string;
  to: string;
  amount: number;
  file: string;
};

@Injectable()
export class SaveTransactionsUsecase {
  constructor(
    private readonly saveTransactionsRepository: SaveTransactionRepository,
    private readonly saveTransactionsResume: SaveTransactionsResumeRepository,
  ) {}

  public async execute(transactions: Transaction[]) {
    const transactionPerFile = this.groupTransactionsByFile(transactions);

    const savePromises = [];

    for (const file of Object.keys(transactionPerFile)) {
      const fileTransactions: Transaction[] = transactionPerFile[file];

      const { nonSuspiciousTransactions, suspiciousTransactions } =
        this.findSuspiciousTransactions(fileTransactions);

      const { nonNegativedTransactions, negativedTransactions } =
        this.findNegativedTransactions(nonSuspiciousTransactions);

      const rejectedTransactionsResume: Omit<TransactionsResume, 'id'> = {
        fileName:
          suspiciousTransactions[0].file || negativedTransactions[0].file,
        reason: 'File has transactions an invalid amount',
        totalNonProcessed:
          suspiciousTransactions.length + negativedTransactions.length,
      };

      const { uniquesTransactions, duplicatedTransactions } =
        this.findDuplicatedTransactions(nonNegativedTransactions);

      if (duplicatedTransactions.length !== 0) {
        rejectedTransactionsResume.reason =
          'File has duplicate transactions and with invalid amount';

        const totalNonProcessed =
          suspiciousTransactions.length +
          negativedTransactions.length +
          duplicatedTransactions.length;
        rejectedTransactionsResume.totalNonProcessed = totalNonProcessed;
      }

      const transactionsResumePromise = this.saveTransactionsResume.saveResume(
        rejectedTransactionsResume,
      );

      savePromises.push(transactionsResumePromise);

      const saveTransactionsPromise =
        this.saveTransactionsRepository.saveMany(uniquesTransactions);

      savePromises.push(saveTransactionsPromise);
    }

    await Promise.all(savePromises);

    return {
      transactionsProcessed: transactions.length,
    };
  }

  private groupTransactionsByFile(transactions: Transaction[]) {
    const groupedTransactions = transactions.reduce(
      (group, transaction) => {
        if (!group[transaction.file]) {
          group[transaction.file] = [];
        }

        group[transaction.file].push(transaction);
        return group;
      },
      {} as Record<string, Transaction[]>,
    );

    return groupedTransactions;
  }

  private findNegativedTransactions(transactions: Transaction[]) {
    const nonNegativedTransactions: Transaction[] = [];
    const negativedTransactions: Transaction[] = [];

    const isNegativedTransaction = (transaction: Transaction) =>
      transaction.amount < 0;

    transactions.forEach((transaction) => {
      if (isNegativedTransaction(transaction)) {
        negativedTransactions.push(transaction);
      } else {
        nonNegativedTransactions.push(transaction);
      }
    });

    return { nonNegativedTransactions, negativedTransactions };
  }

  private findSuspiciousTransactions(transactions: Transaction[]) {
    const nonSuspiciousTransactions: Transaction[] = [];
    const suspiciousTransactions: Transaction[] = [];

    const maxAmountInCentsPerTransaction = 5000000;
    const isSuspiciousTransaction = (transaction: Transaction) =>
      transaction.amount > maxAmountInCentsPerTransaction;

    transactions.forEach((transaction) => {
      if (isSuspiciousTransaction(transaction)) {
        suspiciousTransactions.push(transaction);
      } else {
        nonSuspiciousTransactions.push(transaction);
      }
    });

    return { nonSuspiciousTransactions, suspiciousTransactions };
  }

  private findDuplicatedTransactions(transactions: Transaction[]) {
    const uniquesSet = new Set<string>();

    const uniques: Transaction[] = [];
    const duplicates: Transaction[] = [];

    for (const transaction of transactions) {
      const identifier = JSON.stringify(transaction);

      if (uniquesSet.has(identifier)) {
        duplicates.push(transaction);
      } else {
        uniquesSet.add(identifier);
        uniques.push(transaction);
      }
    }

    return { uniquesTransactions: uniques, duplicatedTransactions: duplicates };
  }
}
