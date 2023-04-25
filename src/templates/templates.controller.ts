import mongoose from 'mongoose';
import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { TemplatesService } from './templates.service';
import { TemplateDTO } from './template.dto';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(
    private readonly userService: UserService,
    private readonly templateService: TemplatesService,
  ) {}

  @Post('/create')
  async create(@Body() templateData: TemplateDTO, @Request() req) {
    const { user } = req;
    return await this.templateService.create(user._id, templateData);
  }

  @Post('/edit/:id')
  async edit(@Body() templateData: TemplateDTO, @Param('id') id: mongoose.Types.ObjectId) {
    await this.templateService.isTemplateExists(id);
    return await this.templateService.update(id, templateData);
  }

  @Post('/delete/:id')
  async delete(@Param('id') id: mongoose.Types.ObjectId) {
    const template = await this.templateService.isTemplateExists(id);
    const user = await this.userService.findById(template.owner_id);
    if (user) {
      user.templates = user.templates.filter(wid => !template._id.equals(wid));
      await this.userService.update(user._id, user);
    }
    return await this.templateService.delete(id);
  }

  @Get('')
  async get(@Request() req) {
    const templates = [];
    const { user } = req;
    for (const templateId of user.templates) {
      const template = await this.templateService.findById(templateId);
      if (template) {
        templates.push(template);
      }
    }
    return templates;
  }
}
