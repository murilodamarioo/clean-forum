import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const answerQuestionBodySchema = z.object({
  content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string
  ) {
    
    const { content } = body

    const authorId = user.sub

    const response = await this.answerQuestion.execute({
      content,
      questionId,
      authorId,
      attachmentsIds: []
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}