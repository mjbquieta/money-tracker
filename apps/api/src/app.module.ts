import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { SettingsModule } from './settings/settings.module';
import { CategoryModule } from './category/category.module';
import { BudgetPeriodModule } from './budget-period/budget-period.module';
import { ExpenseModule } from './expense/expense.module';
import { ExpenseGroupModule } from './expense-group/expense-group.module';
import { IncomeModule } from './income/income.module';
import { PersonalBudgetModule } from './personal-budget/personal-budget.module';
import { ExpenseTemplateModule } from './expense-template/expense-template.module';
import { RecurringExpenseModule } from './recurring-expense/recurring-expense.module';
import { TagModule } from './tag/tag.module';
import { FinancialGoalModule } from './financial-goal/financial-goal.module';
import { DebtModule } from './debt/debt.module';
import { ExportModule } from './export/export.module';
import { NotificationModule } from './notification/notification.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport:
            configService.get('APP_ENV') !== 'production'
              ? { target: 'pino-pretty', options: { colorize: true } }
              : undefined,
          level: configService.get('APP_ENV') !== 'production' ? 'debug' : 'info',
          redact: ['req.headers.authorization', 'req.body.password', 'req.body.currentPassword', 'req.body.newPassword'],
          autoLogging: true,
        },
      }),
    }),
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
    IncomeModule,
    PersonalBudgetModule,
    ExpenseTemplateModule,
    RecurringExpenseModule,
    TagModule,
    FinancialGoalModule,
    DebtModule,
    ExportModule,
    NotificationModule,
    VehicleModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
