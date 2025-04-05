import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Body, Controller, HttpCode, Param, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnAnswerBodySchema = z.object({
  content: z.string()
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationType = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
    @Body(bodyValidationType) body: CommentOnAnswerBodySchema
  ) {
    const userId = user.sub

    const { content } = body

    const response = await this.commentOnAnswer.execute({
      authorId: userId,
      answerId,
      content
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}