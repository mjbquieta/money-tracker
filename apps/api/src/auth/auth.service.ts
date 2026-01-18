import { Injectable } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { isEmpty } from 'lodash';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(payload: LoginDto) {
    const isEmail = !isEmpty(payload.email);
    const val = (isEmail ? payload.email : payload.username) || '';

    return this.userService.findByCredentials(val, payload.password, isEmail);
  }
}
