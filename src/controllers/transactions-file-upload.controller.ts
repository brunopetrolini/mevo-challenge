import { Controller, Post } from '@nestjs/common';
import { parseFile } from 'fast-csv';
import { resolve } from 'path';
import { PrismaService } from 'src/services/prisma.service';

type Transactions = {
  to: string;
  from: string;
  amount: number;
};

@Controller('/transactions')
export class TransactionsFileUploadController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('/upload')
  public async uploadFile() {
    const parsedTransactions: Transactions[] = [];

    parseFile(resolve('./payload.csv'), {
      delimiter: ';',
      headers: true,
    })
      .on('error', (error) => console.error(error))
      .on('data', (row) => parsedTransactions.push(row));
  }
}
