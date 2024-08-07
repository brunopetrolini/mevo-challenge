import { Controller, Post } from '@nestjs/common';
import { parseFile } from 'fast-csv';
import { resolve } from 'path';
import { PrismaService } from 'src/services/prisma.service';

@Controller('/transactions')
export class TransactionsFileUploadController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('/upload')
  public async uploadFile() {
    parseFile(resolve('./payload.csv'), {
      delimiter: ';',
      headers: true,
    })
      .on('error', (error) => console.error(error))
      .on('data', (row) => console.log(row))
      .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
  }
}
