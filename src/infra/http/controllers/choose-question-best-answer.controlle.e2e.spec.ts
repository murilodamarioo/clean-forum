import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-questions'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Choose question best answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, AppModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory]
    }).compile()
    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[PATCH] /answers/:answerId/choose-as-best', async () => {
    const questionAuthor = await studentFactory.makePrismaStudent()
    const answerAuthor = await studentFactory.makePrismaStudent()
    
    const accessToken = jwt.sign({ sub: questionAuthor.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: questionAuthor.id })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: answerAuthor.id,
      questionId: question.id
    })
    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

      expect(response.statusCode).toBe(204)

      const questionOnDatabase =  await prisma.question.findUnique({
        where: {
          id: question.id.toString()
        }
      })

      expect(questionOnDatabase?.bestAnswerId).toEqual(answerId)
  })
})