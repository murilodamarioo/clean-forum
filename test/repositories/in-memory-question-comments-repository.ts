
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const questinComment = this.items.find((item) => item.id.toString() === id)

    if(!questinComment) {
      return null
    }

    return questinComment
  }

  async findManyByQuestionIdWithAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]> {
    const questionComments = this.items
    .filter(item => item.questionId.toString() === questionId)
    .slice((params.page - 1) * 20, params.page * 20)
    .map(comment => {
      const author = this.studentsRepository.items.find(student => {
        return student.id.equals(comment.authorId)
      })

      if (!author) {
        throw new Error(`Author with ID "${comment.authorId.toString()}" does not exist`)
      }

      return CommentWithAuthor.create({
        commentId: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updateAt: comment.updatedAt,
        authorId: comment.authorId,
        author: author.name
      })
    })

    return questionComments
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === questionComment.id)

    this.items.splice(itemIndex, 1)
  }

}