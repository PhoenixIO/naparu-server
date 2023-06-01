import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { UserModule } from 'src/user/user.module';
import { ExamSchema } from './exam.schema';
import { TemplatesModule } from 'src/templates/templates.module';

@Module({
  imports: [
    UserModule,
    TemplatesModule,
    MongooseModule.forFeature([{ name: 'Exam', schema: ExamSchema }]),
  ],
  providers: [ExamService],
  controllers: [ExamController]
})
export class ExamModule {}
