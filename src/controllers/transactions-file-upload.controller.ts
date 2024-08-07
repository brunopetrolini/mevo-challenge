import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/services/prisma.service';
import { parseCSVFiles } from 'src/utils/parse-files';

@Controller('/transactions')
export class TransactionsFileUploadController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('/upload')
  @UseInterceptors(AnyFilesInterceptor())
  public async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const filesData = parseCSVFiles<{
      to: string;
      from: string;
      amount: string;
    }>(files);

    return filesData;
  }
}
