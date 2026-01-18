import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserWithSettingsDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UUID } from 'crypto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: CreateUserWithSettingsDto,
  ) {
    return this.userService.createUser(body);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: UUID,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, body);
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  async changePassword(
    @CurrentUser('id') userId: UUID,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, body);
  }
}
