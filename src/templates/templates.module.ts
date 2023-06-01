import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { UserModule } from 'src/user/user.module';
import { TemplateSchema } from './template.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Template', schema: TemplateSchema }]),
  ],
  exports: [TemplatesService],
  providers: [TemplatesService],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
