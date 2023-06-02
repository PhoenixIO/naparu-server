import * as path from 'path';
import { PythonShell } from 'python-shell';
import { Injectable } from '@nestjs/common';
import { PromptDTO } from './prompt.dto';

@Injectable()
export class OpenaiService {
  async createAnswers(promptData: PromptDTO) {
    const prompt = `Поясни та аргументуй чи правильна відповідь. Питання: ${promptData.question}. Відповідь: ${promptData.answer}. Пиши на українській мові.`

    try {
      const pyprogPath = path.resolve(__dirname,  '../../../../gpt4free/gui/naparu.py');
      const results = await PythonShell.run(pyprogPath, {
        mode: 'text',
        args: [prompt],
      });
      let result = results[0];
      const unicodeRegexp = /\\u([\d\w]{4})/gi;
      result = result.replace(unicodeRegexp, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
      return { result };
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
