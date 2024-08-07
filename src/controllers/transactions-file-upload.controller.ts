import { Controller, Post } from '@nestjs/common';
import { parseFile } from 'fast-csv';
import { resolve } from 'path';

@Controller('/transactions')
export class TransactionsFileUploadController {
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
