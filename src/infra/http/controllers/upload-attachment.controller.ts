import { Controller, FileTypeValidator, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const parseFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 1024 * 1024 * 2, // 2mb
    }),
    new FileTypeValidator({
      fileType: '.(png|jpg|jpeg|pdf)',
    }),
  ],
})

@Controller('/attachments')
export class UploadAttachmentController {
  // constructor() {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(parseFilePipe) file: Express.Multer.File) {
    console.log(file)
  }
}