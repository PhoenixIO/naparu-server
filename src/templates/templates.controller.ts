import mongoose from 'mongoose';
import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TemplatesService } from './templates.service';
import { TemplateDTO } from './template.dto';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(
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

  @Get('')
  async get(@Request() req) {
    const templates = [];
    const { user } = req;
    for (const templateId of user.templates) {
      const template = await this.templateService.findById(templateId);
      templates.push(template);
    }
    return templates;
  }
}
