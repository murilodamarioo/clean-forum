import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCretedEvent } from '@/domain/forum/enterprise/entities/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this), 
      AnswerCretedEvent.name
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCretedEvent) {
    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if(question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `New Answer in ${question.title.substring(0, 40).concat('...')}`,
        content: answer.execerpt
      })
    }
  }
  
}