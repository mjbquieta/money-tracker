"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const nestjs_pino_1 = require("nestjs-pino");
const settings_module_1 = require("./settings/settings.module");
const category_module_1 = require("./category/category.module");
const budget_period_module_1 = require("./budget-period/budget-period.module");
const expense_module_1 = require("./expense/expense.module");
const expense_group_module_1 = require("./expense-group/expense-group.module");
const income_module_1 = require("./income/income.module");
const personal_budget_module_1 = require("./personal-budget/personal-budget.module");
const expense_template_module_1 = require("./expense-template/expense-template.module");
const recurring_expense_module_1 = require("./recurring-expense/recurring-expense.module");
const tag_module_1 = require("./tag/tag.module");
const financial_goal_module_1 = require("./financial-goal/financial-goal.module");
const debt_module_1 = require("./debt/debt.module");
const export_module_1 = require("./export/export.module");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            nestjs_pino_1.LoggerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    pinoHttp: {
                        transport: configService.get('APP_ENV') !== 'production'
                            ? { target: 'pino-pretty', options: { colorize: true } }
                            : undefined,
                        level: configService.get('APP_ENV') !== 'production' ? 'debug' : 'info',
                        redact: ['req.headers.authorization', 'req.body.password', 'req.body.currentPassword', 'req.body.newPassword'],
                        autoLogging: true,
                    },
                }),
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [{ ttl: 60000, limit: 100 }],
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            settings_module_1.SettingsModule,
            category_module_1.CategoryModule,
            budget_period_module_1.BudgetPeriodModule,
            expense_module_1.ExpenseModule,
            expense_group_module_1.ExpenseGroupModule,
            income_module_1.IncomeModule,
            personal_budget_module_1.PersonalBudgetModule,
            expense_template_module_1.ExpenseTemplateModule,
            recurring_expense_module_1.RecurringExpenseModule,
            tag_module_1.TagModule,
            financial_goal_module_1.FinancialGoalModule,
            debt_module_1.DebtModule,
            export_module_1.ExportModule,
            notification_module_1.NotificationModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map