import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsDto } from './settings.dto';
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
}
