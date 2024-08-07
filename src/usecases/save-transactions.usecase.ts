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
    const maxAmountInCentsPerTransaction = 5000000;
    const suspiciousTransactionsFilter = (transaction: Transaction) =>
      transaction.amount > maxAmountInCentsPerTransaction;

    const suspiciousTransactions = transactions.filter(
      suspiciousTransactionsFilter,
    );
    const nonSuspiciousTransactions = transactions.filter(
      (transaction) => !suspiciousTransactionsFilter(transaction),
    );

    const negativedTransactionsFilter = (transaction: Transaction) =>
      transaction.amount < 0;
    const negativedTransactions = nonSuspiciousTransactions.filter(
      negativedTransactionsFilter,
    );

    const transactionsWithValidAmount = transactions.filter(
      (transaction) => !negativedTransactionsFilter(transaction),
    );

    const rejectedTransactionsResume: Omit<TransactionsResume, 'id'> = {
      fileName: suspiciousTransactions[0].file || negativedTransactions[0].file,
      reason: 'File has transactions an invalid amount',
      totalNonProcessed:
        suspiciousTransactions.length + negativedTransactions.length,
    };

    const transactionsToCreate = transactionsWithValidAmount.map(
      (transaction) => ({
        id: Buffer.from(
          `${transaction.file}#${transaction.from}#${transaction.to}#${transaction.amount}`,
        ).toString('base64'),
        to: transaction.to,
        from: transaction.from,
        amount: transaction.amount,
        fileName: transaction.file,
      }),
    );

    const transactionsResumePromise =
      this.prismaService.transactionsResume.create({
        data: rejectedTransactionsResume,
      });

    const saveTransactionsPromise = this.prismaService.transaction.createMany({
      data: transactionsToCreate,
    });

    await Promise.all([saveTransactionsPromise, transactionsResumePromise]);

    return {
      transactionsProcessed: transactions.length,
    };
  }
}
