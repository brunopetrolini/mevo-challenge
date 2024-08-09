import { Module } from '@nestjs/common';
import { SaveTransactionRepository } from 'src/domain/repositories/save-transaction.repository';
import { SaveTransactionsResumeRepository } from 'src/domain/repositories/save-transactions-resume.repository';
import { SaveTransactionsPrismaRepository } from './repositories/save-transactions-prisma.repository';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [
    PrismaService,
    SaveTransactionsPrismaRepository,
    {
      provide: SaveTransactionRepository,
      useExisting: SaveTransactionsPrismaRepository,
    },
    {
      provide: SaveTransactionsResumeRepository,
      useExisting: SaveTransactionsPrismaRepository,
    },
  ],
  exports: [SaveTransactionRepository, SaveTransactionsResumeRepository],
})
export class InfrastructureModule {}
