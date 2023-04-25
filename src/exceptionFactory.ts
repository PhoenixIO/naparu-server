import { BadRequestException, ValidationError } from "@nestjs/common"

const customErrors = {
  // register.dto.ts, login.dto.ts
  email: 'Вкажіть правильний E-mail',
  password: 'Пароль має бути довжиною від 8 до 128 символов',
  // template.dto.ts
  title: 'Заголовок має бути довжиною від 2 до 128 символів!',
  questions: 'Щось не то! Перевірте чи заповнили усі запитання та відповіді',
};

export const exceptionFactory = (errors: ValidationError[]) => {
  for (const error of errors) {
    return new BadRequestException(
      customErrors[error.property] ? customErrors[error.property] : Object.values(error.constraints).join('\n')
    );
  }
}
