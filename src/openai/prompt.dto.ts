import { IsString, Length } from 'class-validator';

export class PromptDTO {
  @IsString() @Length(1, 128) question: string;

  @IsString() @Length(1, 128) answer: string;
}
