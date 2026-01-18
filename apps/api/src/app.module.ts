import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SettingsModule } from './settings/settings.module';
import { CategoryModule } from './category/category.module';
import { BudgetPeriodModule } from './budget-period/budget-period.module';
import { ExpenseModule } from './expense/expense.module';
import { ExpenseGroupModule } from './expense-group/expense-group.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    SettingsModule,
    CategoryModule,
    BudgetPeriodModule,
    ExpenseModule,
    ExpenseGroupModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
