import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './register.dto';
import { LoginDTO } from './login.dto';
import { RegisterAdminDTO } from './register-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDTO) {
    const user = await this.userService.login(loginData);
    const payload = { email: user.email };
    const token = await this.jwtService.sign(payload);
    return { user, token };
  }

  async register(registrationData: RegisterDTO) {
    const user = await this.userService.create(registrationData);
    const payload = { email: user.email };
    const token = await this.jwtService.sign(payload);
    return { user, token };
  }

  async registerAdmin(registerAdminData: RegisterAdminDTO) {
    const user = await this.userService.createAdmin(registerAdminData);
    const payload = { email: user.email };
    const token = await this.jwtService.sign(payload);
    return { user, token };
  }

  async validateUser(payload: any) {
    return await this.userService.findByPayload(payload);
  }
}
