import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsString, Length, ValidateNested } from "class-validator";

export enum QuestionType {
  Checkbox = 'checkbox',
  Radiobutton = 'radiobutton',
}

export class TemplateAnswer {
  @IsString() @Length(1, 256) text: string;

  @IsString() @Length(0, 1024) description?: string;

  @IsBoolean() correct: boolean;
}

export class TemplateQuestion {
  @IsString() @Length(1, 256) title: string;

  @IsEnum(QuestionType) type: QuestionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateAnswer)
  answers: TemplateAnswer[];
}

export class TemplateDTO {
  @IsString() @Length(1, 256) title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateQuestion)
  questions: TemplateQuestion[];
}
