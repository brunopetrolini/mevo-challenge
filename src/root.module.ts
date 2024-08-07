import { Module } from '@nestjs/common';
import { TransactionsFileUploadController } from './controllers/transactions-file-upload.controller';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [],
  controllers: [TransactionsFileUploadController],
  providers: [PrismaService],
})
export class RootModule {}
