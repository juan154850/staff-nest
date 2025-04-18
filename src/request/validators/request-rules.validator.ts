import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import {
  OverlappingRequestException,
  RequestDateInPastException,
  RequestEndBeforeStartException,
} from '../exceptions/create-request.exceptions';

export async function validateRequestRules(
  prisma: PrismaService,
  dto: CreateRequestDto,
): Promise<void> {
  const now = new Date();
  const startDate = new Date(dto.startDate);
  const endDate = new Date(dto.endDate);

  if (startDate < now) {
    throw new RequestDateInPastException();
  }

  if (endDate <= startDate) {
    throw new RequestEndBeforeStartException();
  }

  const overlapping = await prisma.request.findFirst({
    where: {
      employeeId: dto.employeeId,
      status: {
        not: 'Rejected',
      },
      OR: [
        {
          startDate: {
            lte: endDate,
          },
          endDate: {
            gte: startDate,
          },
        },
      ],
    },
  });

  if (overlapping) {
    throw new OverlappingRequestException();
  }
}
