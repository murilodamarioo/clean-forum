import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { BadRequestException, Controller, Get, HttpCode, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comments-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController { 
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('answerId') answerId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const response = await this.fetchAnswerComments.execute({
      answerId,
      page
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }

    const answerComments = response.value.answerComments

    return { comments: answerComments.map(CommentPresenter.toHTTP) }
  }
}