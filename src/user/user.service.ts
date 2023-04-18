import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { RegisterDTO } from '../auth/register.dto';
import { RegisterAdminDTO } from '../auth/register-admin.dto';
import { LoginDTO } from '../auth/login.dto';
import { Role } from 'src/auth/roles/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async create(registrationData: RegisterDTO) {
    const { email } = registrationData;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('Користувач вже існує', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const accountData = {
      ...registrationData,
      password: hashedPassword,
      roles: [Role.User],
    };

    const createdUser = new this.userModel(accountData);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async createAdmin(registerAdminData: RegisterAdminDTO) {
    const { email } = registerAdminData;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('Користувач вже існує', HttpStatus.BAD_REQUEST);
    }
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword && registerAdminData.admin_password !== adminPassword) {
      throw new HttpException('Невірний пароль адміністратора', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(registerAdminData.password, 10);
    const accountData = {
      ...registerAdminData,
      password: hashedPassword,
      roles: [Role.User, Role.Admin],
    };

    const createdUser = new this.userModel(accountData);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('Такого користувача не існує', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async login(loginData: LoginDTO) {
    const { email, password } = loginData;
    const user = await this.findByEmail(email);
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Невірний логін або пароль', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.userModel.find({});
  }

  async findById(id: mongoose.Types.ObjectId) {
    return await this.userModel.findById(id).exec();
  }

  async findByPayload(payload: any) {
    const { email } = payload;
    const user = await this.userModel.findOne({ email });
    return user ? this.sanitizeUser(user) : null;
  }

  async update(id: mongoose.Types.ObjectId, updateUser: UserDocument) {
    return await this.userModel.findByIdAndUpdate(id, updateUser, { new: true }).exec();
  }

  sanitizeUser(user: UserDocument) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
