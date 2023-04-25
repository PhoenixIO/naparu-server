import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TemplateQuestion } from './template.dto';

export type TemplateDocument = Template & Document;

@Schema({ timestamps: true })
export class Template {
  @Prop() owner_id: mongoose.Types.ObjectId;

  @Prop({ required: true }) title: string;

  @Prop() questions: TemplateQuestion[];
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
