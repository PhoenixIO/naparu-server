import { Controller, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDTO } from './register.dto';
import { LoginDTO } from './login.dto';
import { RegisterAdminDTO } from './register-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerData: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.register(registerData);
    res.set('Authorization', `Bearer ${data.token}`);
    res.cookie('auth-token', data.token, { httpOnly: true });
    return data;
  }

  @Post('/register/admin')
  async registerAdmin(
    @Body() registerAdminData: RegisterAdminDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.registerAdmin(registerAdminData);
    res.set('Authorization', `Bearer ${data.token}`);
    res.cookie('auth-token', data.token, { httpOnly: true });
    return data;
  }

  @Post('/login')
  async login(
    @Body() loginData: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginData);
    res.set('Authorization', `Bearer ${data.token}`);
    res.cookie('auth-token', data.token, { httpOnly: true });
    return data;
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const data = res.cookie('auth-token', '', { httpOnly: true });
    return data.statusCode;
  }
}
