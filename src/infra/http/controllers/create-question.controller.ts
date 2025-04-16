import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid())
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@CurrentUser() user: UserPayload, @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema) {
    const { title, content, attachments } = body
    const userId = user.sub

    const response = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}
