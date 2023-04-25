import mongoose from 'mongoose';
import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { CreateExamDTO } from './create-exam.dto';
import { ExamService } from './exam.service';

@Controller('exams')
export class ExamController {
  constructor(
    private readonly userService: UserService,
    private readonly examService: ExamService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Body() examData: CreateExamDTO, @Request() req) {
    const { user } = req;
    return await this.examService.create(user._id, examData);
  }

  @Post('/delete/:id')
  async delete(@Param('id') id: mongoose.Types.ObjectId) {
    const exam = await this.examService.isExamExists(id);
    const user = await this.userService.findById(exam.owner_id);
    if (user) {
      user.exams = user.exams.filter(wid => !exam._id.equals(wid));
      await this.userService.update(user._id, user);
    }
    return await this.examService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async get(@Request() req) {
    const exams = [];
    const { user } = req;
    for (const examId of user.exams) {
      const exam = await this.examService.findById(examId);
      if (exam) {
        exams.push(exam);
      }
    }
    return exams;
  }
}
