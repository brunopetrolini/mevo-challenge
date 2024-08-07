import { Injectable } from '@nestjs/common';
import { TransactionsResume } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

export type Transaction = {
  from: string;
  to: string;
  amount: number;
  file: string;
};

@Injectable()
export class SaveTransactionsUsecase {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(transactions: Transaction[]) {
    const { nonSuspiciousTransactions, suspiciousTransactions } =
      this.findSuspiciousTransactions(transactions);

    const { nonNegativedTransactions, negativedTransactions } =
      this.findNegativedTransactions(nonSuspiciousTransactions);

    const rejectedTransactionsResume: Omit<TransactionsResume, 'id'> = {
      fileName: suspiciousTransactions[0].file || negativedTransactions[0].file,
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

    const transactionsToCreate = uniquesTransactions.map((transaction) => ({
      id: Buffer.from(
        `${transaction.file}#${transaction.from}#${transaction.to}#${transaction.amount}`,
      ).toString('base64'),
      to: transaction.to,
      from: transaction.from,
      amount: transaction.amount,
      fileName: transaction.file,
    }));

    const transactionsResumePromise =
      this.prismaService.transactionsResume.create({
        data: rejectedTransactionsResume,
      });

    const saveTransactionsPromise =
      this.prismaService.transaction.createManyAndReturn({
        data: transactionsToCreate,
      });

    await Promise.all([saveTransactionsPromise, transactionsResumePromise]);

    return {
      transactionsProcessed: transactions.length,
    };
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

    transactions.forEach((transaction) => {
      const identifier = JSON.stringify(transaction);
      if (uniquesSet.has(identifier)) {
        duplicates.push(transaction);
      } else {
        uniquesSet.add(identifier);
        uniques.push(transaction);
      }
    });

    return { uniquesTransactions: uniques, duplicatedTransactions: duplicates };
  }
}
