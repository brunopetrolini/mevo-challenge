import { Module } from '@nestjs/common';
import { TransactionsFileUploadController } from './controllers/transactions-file-upload.controller';
import { PrismaService } from './services/prisma.service';
import { SaveTransactionsUsecase } from './usecases/save-transactions.usecase';

@Module({
  imports: [],
  controllers: [TransactionsFileUploadController],
  providers: [PrismaService, SaveTransactionsUsecase],
})
export class RootModule {}
