import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserWithSettingsDto } from './user.dto';

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
}
