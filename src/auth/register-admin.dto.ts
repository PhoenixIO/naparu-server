import { IsEmail, Length, IsNotEmpty } from 'class-validator';

export class RegisterAdminDTO {
  @IsEmail() email: string;

  @Length(2, 16) name: string;

  @Length(8, 128) password: string;

  @IsNotEmpty() admin_password: string;
}
