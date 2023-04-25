import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { OpenaiModule } from './openai/openai.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TemplatesModule } from './templates/templates.module';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    OpenaiModule,
    AuthModule,
    UserModule,
    TemplatesModule,
    ExamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
