import { Prisma } from '@prisma/client';

export async function paginate<T>(
  model: Prisma.ModelName,
  prisma: any, // PrismaService
  page = 1,
  limit = 10,
  args: Prisma.Enumerable<any> = {},
): Promise<{
  data: T[];
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

  return {
    data,
    totalRecords,
    currentPage: page,
    lastPage,
    hasMorePages: page < lastPage,
  };
}
