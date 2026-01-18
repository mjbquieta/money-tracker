import { ConflictException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IncomeSourceDto } from './income-source.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class IncomeSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: UUID,
    payload: IncomeSourceDto,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const existing = await client.incomeSource.findFirst({
      where: {
        userId,
        name: payload.name,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('Income source name already exists');
    }

    return client.incomeSource.create({
      data: {
        userId,
        ...payload,
      },
    });
  }
}
