import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserWithSettingsDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { omit } from 'lodash';
import { SettingsService } from 'src/settings/settings.service';
import { UUID } from 'crypto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class UserService {
  private saltRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly settingsService: SettingsService,
    private readonly categoryService: CategoryService,
  ) {
    this.saltRounds = Number(this.configService.get('SALT_ROUNDS'));
  }

  async createUser(payload: CreateUserWithSettingsDto) {
    const data = omit(payload, ['password', 'settings']);
    const hashedPassword = await bcrypt.hash(payload.password, this.saltRounds);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      await this.settingsService.create(user.id as UUID, payload.settings, tx);
      await this.categoryService.createDefaultCategories(user.id as UUID, tx);

      return tx.user.findUnique({
        where: { id: user.id },
        omit: { password: true },
        include: { settings: true, categories: true },
      });
    });
  }

  async findByCredentials(
    val: string,
    password: string,
    isEmail: boolean = true,
  ) {
    const w = isEmail ? { email: val } : { username: val };

    const user = await this.prisma.user.findUnique({
      where: {
        ...w,
        deletedAt: null,
      },
      include: { settings: true },
    });

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return omit(user, ['password']);
  }

  async findOne(userId: UUID) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true, categories: true },
    });
    return omit(user, ['password']);
  }

  async updateProfile(userId: UUID, payload: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: payload,
      include: { settings: true, categories: true },
    });
    return omit(user, ['password']);
  }

  async changePassword(userId: UUID, payload: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      payload.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      payload.newPassword,
      this.saltRounds,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
