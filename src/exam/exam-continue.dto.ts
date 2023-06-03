import { IsBoolean, IsObject, IsOptional, IsString, Length } from "class-validator";

// class Answers {
//   @IsObject() [key: number]: boolean;
// }

export class ExamContinueDTO {
  @IsOptional() @IsString() @Length(3, 50) username?: string;

  @IsOptional() answers?: any;

  @IsOptional() @IsBoolean() next?: boolean;
}
