import { Prisma } from '@prisma/client';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export async function paginate<T, D = T>(
  model: Prisma.ModelName,
  prisma: any, // PrismaService
  page = 1,
  limit = 10,
  args: Prisma.Enumerable<any> = {},
  dto?: ClassConstructor<D>,
): Promise<{
  data: D[];
  totalRecords: number;
  currentPage: number;
  lastPage: number;
  hasMorePages: boolean;
}> {
  const [totalRecords, data] = await prisma.$transaction([
    prisma[model].count({ where: args.where }),
    prisma[model].findMany({
      ...args,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const lastPage = Math.ceil(totalRecords / limit);

  const transformed = dto
    ? plainToInstance(dto, data, { excludeExtraneousValues: true })
    : data;

  return {
    data: transformed,
    totalRecords,
    currentPage: page,
    lastPage,
    hasMorePages: page < lastPage,
  };
}
