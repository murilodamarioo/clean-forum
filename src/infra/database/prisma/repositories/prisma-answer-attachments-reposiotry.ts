import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-reposiotry'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {

  findManyByAnswerId(answersId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.');
  }
  
  deleteManyByAnswerId(answersId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  
}