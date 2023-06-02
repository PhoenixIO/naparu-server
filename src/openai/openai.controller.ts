import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PromptDTO } from './prompt.dto';
import { OpenaiService } from './openai.service';

@Controller('openai')
@UseGuards(JwtAuthGuard)
export class OpenaiController {
  constructor(
    private readonly openaiService: OpenaiService,
  ) {}

  @Post('/generate/description')
  async generateDescription(@Body() promptData: PromptDTO) {
    return this.openaiService.createAnswers(promptData);
  }
}
