import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { envSchema } from './env';
import { AuthenticateController } from './http/controllers/authenticate.controller';
import { CreateQuestionController } from './http/controllers/create-question.controller';
import { CreateAccountController } from './http/controllers/create-account.controller';
import { FetchRecentQuestionsController } from './http/controllers/fetch-recent-questions.controller';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule,
    HttpModule
  ]
})
export class AppModule {}
