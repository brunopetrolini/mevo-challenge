import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  SaveTransactionsUsecase,
  Transaction,
} from 'src/domain/usecases/save-transactions.usecase';
import { parseCSVFiles } from 'src/utils/parse-files';

type CsvFileData = {
  to: string;
  from: string;
  amount: string;
};

type CsvFile = {
  name: string;
  content: CsvFileData[];
};

@Controller('/transactions')
export class TransactionsFileUploadController {
  constructor(
    private readonly saveTransactionsUsecase: SaveTransactionsUsecase,
  ) {}

  @Post('/upload')
  @UseInterceptors(AnyFilesInterceptor())
  public async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const filesData = parseCSVFiles<CsvFileData>(files);

    const transactions = this.transformToTransaction(filesData);
    const result = await this.saveTransactionsUsecase.execute(transactions);

    return result;
  }

  private transformToTransaction(filesData: CsvFile[]): Transaction[] {
    const transactions: Transaction[] = [];

    filesData.forEach((file) => {
      file.content.forEach((fileContent) =>
        transactions.push({
          to: fileContent.to,
          from: fileContent.from,
          amount: Number(fileContent.amount),
          file: file.name,
        }),
      );
    });

    return transactions;
  }
}
