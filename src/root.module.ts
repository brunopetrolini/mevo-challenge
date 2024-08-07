import { Module } from '@nestjs/common';
import { TransactionsFileUploadController } from './controllers/transactions-file-upload.controller';
import { SaveTransactionsUsecase } from './domain/usecases/save-transactions.usecase';
import { PrismaService } from './infrastructure/services/prisma.service';

@Module({
  imports: [],
  controllers: [TransactionsFileUploadController],
  providers: [PrismaService, SaveTransactionsUsecase],
})
export class RootModule {}
