import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { IsEmailExistConstraint } from './validators/is-email.validator';
import { IsUsernameExistConstraint } from './validators/is-username.validator';
import { SettingsModule } from 'src/settings/settings.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [ConfigModule, SettingsModule, CategoryModule],
  controllers: [UserController],
  providers: [UserService, IsEmailExistConstraint, IsUsernameExistConstraint],
  exports: [UserService],
})
export class UserModule {}
