import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string
  ) {
    const userId = user.sub

    const response = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId: id
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}