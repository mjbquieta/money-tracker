"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
const settings_service_1 = require("../settings/settings.service");
const category_service_1 = require("../category/category.service");
let UserService = class UserService {
    prisma;
    configService;
    settingsService;
    categoryService;
    saltRounds;
    constructor(prisma, configService, settingsService, categoryService) {
        this.prisma = prisma;
        this.configService = configService;
        this.settingsService = settingsService;
        this.categoryService = categoryService;
        this.saltRounds = Number(this.configService.get('SALT_ROUNDS'));
    }
    async createUser(payload) {
        const data = (0, lodash_1.omit)(payload, ['password', 'settings']);
        const hashedPassword = await bcrypt.hash(payload.password, this.saltRounds);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    ...data,
                    password: hashedPassword,
                },
            });
            await this.settingsService.create(user.id, payload.settings, tx);
            await this.categoryService.createDefaultCategories(user.id, tx);
            return tx.user.findUnique({
                where: { id: user.id },
                omit: { password: true },
                include: { settings: true, categories: true },
            });
        });
    }
    async findByCredentials(val, password, isEmail = true) {
        const w = isEmail ? { email: val } : { username: val };
        const user = await this.prisma.user.findUnique({
            where: {
                ...w,
                deletedAt: null,
            },
            include: { settings: true },
        });
        const isPasswordValid = await bcrypt.compare(password, user?.password || '');
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return (0, lodash_1.omit)(user, ['password']);
    }
    async findOne(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { settings: true, categories: true },
        });
        return (0, lodash_1.omit)(user, ['password']);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        settings_service_1.SettingsService,
        category_service_1.CategoryService])
], UserService);
//# sourceMappingURL=user.service.js.map