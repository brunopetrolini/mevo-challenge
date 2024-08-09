import { Module } from '@nestjs/common';
import { TransactionsFileUploadController } from './controllers/transactions-file-upload.controller';
import { SaveTransactionsUsecase } from './domain/usecases/save-transactions.usecase';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [SaveTransactionsUsecase],
  controllers: [TransactionsFileUploadController],
})
export class RootModule {}
