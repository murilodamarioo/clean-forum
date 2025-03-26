import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment, QuestionCommentsProps } from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'

export function makeQuestionComment(override: Partial<QuestionCommentsProps> = {}, id?: UniqueEntityID) {
  const questionComment = QuestionComment.create(
    {
    authorId: new UniqueEntityID(),
    questionId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...override
    }, 
    id
  )

  return questionComment
}

export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(data: Partial<QuestionCommentsProps> = {}): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment)
    })

    return questionComment 
  }
}