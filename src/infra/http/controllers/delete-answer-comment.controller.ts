import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Param } from '@nestjs/common'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string
  ) {
    const userId = user.sub

    const response = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId: id
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}