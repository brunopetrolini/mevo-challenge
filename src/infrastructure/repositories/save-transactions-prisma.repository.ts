import { Injectable } from '@nestjs/common';
import {
  SaveManyTransactionsResponse,
  SaveTransactionRepository,
  Transaction,
} from 'src/domain/repositories/save-transaction.repository';
import {
  SaveResumeResponse,
  SaveTransactionsResumeRepository,
  TransactionResume,
} from 'src/domain/repositories/save-transactions-resume.repository';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class SaveTransactionsPrismaRepository
  implements SaveTransactionRepository, SaveTransactionsResumeRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  public async saveMany(
    transactions: Transaction[],
  ): Promise<SaveManyTransactionsResponse> {
    const transactionsToCreate = transactions.map((transaction) => ({
      id: Buffer.from(
        `${transaction.file}#${transaction.from}#${transaction.to}#${transaction.amount}`,
      ).toString('base64'),
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      fileName: transaction.file,
    }));

    const saveTransactionsResult = this.prismaService.transaction.createMany({
      data: transactionsToCreate,
    });

    return saveTransactionsResult;
  }

  public async saveResume(
    transactionResume: TransactionResume,
  ): Promise<SaveResumeResponse> {
    const saveResumeResult = await this.prismaService.transactionsResume.create(
      {
        data: transactionResume,
      },
    );

    return { id: saveResumeResult.id };
  }
}
