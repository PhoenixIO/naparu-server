import { IsMongoId } from "class-validator";
import mongoose from "mongoose";

export class CreateExamDTO {
  @IsMongoId() template_id: mongoose.Types.ObjectId;
}
