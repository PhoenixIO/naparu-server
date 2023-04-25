import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { TemplateDTO } from './template.dto';
import { TemplateDocument } from './template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly userService: UserService,
    @InjectModel('Template') private readonly templateModel: Model<TemplateDocument>,
  ) {}  

  async create(userId: mongoose.Types.ObjectId, templateData: TemplateDTO) {
    const createdTemplate = new this.templateModel({
      ...templateData,
      owner_id: userId,
    });
    await createdTemplate.save();

    const user = await this.userService.findById(userId);
    user.templates.push(createdTemplate._id);
    await this.userService.update(userId, user);
    return createdTemplate;
  }

  async findById(id: mongoose.Types.ObjectId) {
    return await this.templateModel.findById(id).exec();
  }

  async update(id: mongoose.Types.ObjectId | string, templateData: TemplateDTO) {
    return await this.templateModel.findByIdAndUpdate(id, templateData, { new: true }).exec();
  }

  async delete(id: mongoose.Types.ObjectId | string) {
    return await this.templateModel.findByIdAndDelete(id).exec();
  }

  async isTemplateExists(id: mongoose.Types.ObjectId) {
    const template = await this.findById(id);
    if (!template) {
      throw new HttpException('Шаблону з таким ID не знайдено', HttpStatus.BAD_REQUEST);
    }
    return template;
  }
}
