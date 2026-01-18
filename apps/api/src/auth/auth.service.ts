import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { isEmpty } from 'lodash';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto) {
    const isEmail = !isEmpty(payload.email);
    const val = (isEmail ? payload.email : payload.username) || '';

    const user = await this.userService.findByCredentials(
      val,
      payload.password,
      isEmail,
    );

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      user,
      accessToken: this.jwtService.sign(tokenPayload),
    };
  }
}
