import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"

export interface AnswerAttachmentsRepository {

  findManyByAnswerId(answersId: string): Promise<AnswerAttachment[]>

  deleteManyByAnswerId(answersId: string): Promise<void>

}