import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { QuestionFactory } from 'test/factories/make-questions'
import { StudentFactory } from 'test/factories/make-student'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete question comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, AppModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

    const comment = await questionCommentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id
    })
    const commentId = comment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: commentId
      }
    })

    expect(commentOnDatabase).toBeNull()
    
  })
})