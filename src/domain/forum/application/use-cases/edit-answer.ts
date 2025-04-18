import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-reposiotry'
import { Injectable } from '@nestjs/common'


interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { answer: Answer }>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}
 
  async execute({ authorId, answerId, content, attachmentsIds }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
  
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError)
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError)
    }

    const currentAnswersAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answersAttachmentList = new AnswerAttachmentList(currentAnswersAttachments)

    const answersAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id
      })
    })

    answersAttachmentList.update(answersAttachments)

    answer.attachments = answersAttachmentList
    answer.content = content

    await this.answersRepository.save(answer)

    return right({ answer })
  }
} 