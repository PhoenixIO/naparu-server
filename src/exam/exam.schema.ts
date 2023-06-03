import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ExamDocument = Exam & Document;

class UserTest {
  id: string;
  ip: string;
  // answers
}

@Schema({ timestamps: true })
export class Exam {
  @Prop() owner_id: mongoose.Types.ObjectId;

  @Prop() template_id: mongoose.Types.ObjectId;

  @Prop() users: UserTest[];
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
