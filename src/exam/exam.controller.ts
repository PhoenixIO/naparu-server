import mongoose from 'mongoose';
import { Body, Controller, Get, Ip, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { CreateExamDTO } from './create-exam.dto';
import { ExamService } from './exam.service';
import { TemplatesService } from 'src/templates/templates.service';
import { ExamContinueDTO } from './exam-continue.dto';

@Controller('exams')
export class ExamController {
  constructor(
    private readonly userService: UserService,
    private readonly examService: ExamService,
    private readonly templateService: TemplatesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Body() examData: CreateExamDTO, @Request() req) {
    const { user } = req;
    return await this.examService.create(user._id, examData);
  }

  @UseGuards(JwtAuthGuard)
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
  async getAll(@Request() req) {
    const exams = [];
    const { user } = req;
    for (const examId of user.exams) {
      const exam = await this.examService.findById(examId);
      if (exam) {
        const template = await this.templateService.findById(exam.template_id);
        exams.push({ exam, template });
      }
    }
    return exams;
  }

  @Post('/:id')
  async continue(@Request() req, @Ip() ip, @Param('id') id: mongoose.Types.ObjectId, @Body() userData: ExamContinueDTO) {
    const exam = await this.examService.isExamExists(id) as any;
    const template = await this.templateService.isTemplateExists(exam.template_id);

    const { session } = req;
    if (!session.exams) {
      session.exams = {};
    }

    const progress = session.exams[exam._id];
    const { username } = userData;
    const examData = {
      title: template.title,
      createdAt: exam.createdAt,
      questionsCount: template.questions.length,
    };

    // If exam is not started
    if (!progress && !username) {
      return {
        examData,
        progress: {
          started: false,
        },
      };
    }

    // Start exam request
    if (!progress && username) {
      session.exams[exam._id] = {
        started: true,
        questionIndex: 0,
        question: template.questions[0],
        username, 
      };
      return {
        examData,
        progress: session.exams[exam._id],
      };
    }

    // Send description to answers
    if (userData.answers) {
      progress.description = {};
      // check if answer is right
      for (let [key, value] of Object.entries(userData.answers)) {
        if (progress.question.answers[key]) {
          progress.description[key] = progress.question.answers[key].description;
        }
      }
      progress.question = null;

      return {
        examData,
        progress,
      };
    }

    // Next question / exam end
    if (userData.next) {
      progress.description = null;
      progress.questionIndex += 1;
      progress.question = template.questions[progress.questionIndex];

      if (!progress.question) {
        progress.ended = true;
        // write in db
        exam.users.push({
          id: req.sessionID,
          ip,
          // answers
        });
        await exam.save();
      }
    }

    return {
      examData,
      progress,
    };
  }
}
