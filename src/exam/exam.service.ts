import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateExamDTO } from './create-exam.dto';
import { ExamDocument } from './exam.schema';

@Injectable()
export class ExamService {
  constructor(
    private readonly userService: UserService,
    @InjectModel('Exam') private readonly examModel: Model<ExamDocument>,
  ){}

  async create(userId: mongoose.Types.ObjectId, examData: CreateExamDTO) {
    const createdTemplate = new this.examModel({
      ...examData,
      owner_id: userId,
    });
    await createdTemplate.save();

    const user = await this.userService.findById(userId);
    user.exams.push(createdTemplate._id);
    await this.userService.update(userId, user);
    return createdTemplate;
  }

  async findById(id: mongoose.Types.ObjectId) {
    return await this.examModel.findById(id).exec();
  }

  async update(id: mongoose.Types.ObjectId | string, examData: ExamDocument) {
    return await this.examModel.findByIdAndUpdate(id, examData, { new: true }).exec();
  }

  async delete(id: mongoose.Types.ObjectId | string) {
    return await this.examModel.findByIdAndDelete(id).exec();
  }

  async isExamExists(id: mongoose.Types.ObjectId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Невірний ID тестування', HttpStatus.BAD_REQUEST);
    }

    const exam = await this.findById(id);
    if (!exam) {
      throw new HttpException('Тестування з таким ID не знайдено', HttpStatus.BAD_REQUEST);
    }
    return exam;
  }
}
