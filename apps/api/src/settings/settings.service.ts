import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsDto, UpdateSettingsDto } from './settings.dto';
import { Prisma } from '@prisma/client';
import { UUID } from 'crypto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: UUID,
    payload: SettingsDto,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.settings.create({
      data: {
        userId,
        ...payload,
      },
    });
  }

  async findByUserId(userId: UUID) {
    const settings = await this.prisma.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  async update(userId: UUID, payload: UpdateSettingsDto) {
    const settings = await this.prisma.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return this.prisma.settings.update({
      where: { userId },
      data: payload,
    });
  }
}
