import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { BadRequestException, Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const response = await this.getQuestionBySlug.execute({ slug })

    if (response.isLeft()) {
      throw new BadRequestException()
    }

    return{ question: QuestionPresenter.toHTTP(response.value.question) }
  }
}