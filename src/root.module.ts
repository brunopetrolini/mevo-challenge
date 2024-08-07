import { Module } from '@nestjs/common';
import { TransactionsFileUploadController } from './controllers/transactions-file-upload.controller';

@Module({
  imports: [],
  controllers: [TransactionsFileUploadController],
  providers: [],
})
export class RootModule {}
