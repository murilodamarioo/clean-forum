import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment, QuestionCommentsProps } from '@/domain/forum/enterprise/entities/question-comment'

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