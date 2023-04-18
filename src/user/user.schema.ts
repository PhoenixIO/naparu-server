import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../auth/roles/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) email: string;

  @Prop({ required: true }) password: string;

  @Prop({ default: [Role.User] }) roles: Role[];

  @Prop() name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
