import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Request } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { paginate } from 'src/common/utils/pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { validateRequestRules } from './validators/request-rules.validator';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(RequestService.name);

  async createRequest(
    createRequestDto: CreateRequestDto,
  ): Promise<RequestResponseDto> {
    try {
      await validateRequestRules(this.prisma, createRequestDto);
      const request = await this.prisma.request.create({
        data: createRequestDto,
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          approver: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });
      return plainToInstance(RequestResponseDto, request, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error creating request', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Invalid request data');
    }
  }

  async getAllRequests(
    page: number,
    limit: number,
  ): Promise<{
    data: RequestResponseDto[];
    totalRecords: number;
    currentPage: number;
    lastPage: number;
    hasMorePages: boolean;
  }> {
    try {
      return await paginate<Request, RequestResponseDto>(
        Prisma.ModelName.Request,
        this.prisma,
        page,
        limit,
        {},
        RequestResponseDto,
      );
    } catch (error) {
      this.logger.error('Error fetching requests', error);
      return {
        data: [],
        totalRecords: 0,
        currentPage: 0,
        lastPage: 0,
        hasMorePages: false,
      };
    }
  }

  async getAllRequestById(id: string) {
    const request = await this.prisma.request.findUnique({
      where: {
        id,
      },
    });
    if (!request) {
      throw new NotFoundException(`Request not found`);
    }
    return plainToInstance(RequestResponseDto, request);
  }

  async approveRequest(
    id: string,
  ): Promise<{ message: string; data: Request }> {
    const request = await this.prisma.request.findUnique({
      where: {
        id,
      },
    });

    console.log(request)

    if (!request) {
      throw new NotFoundException(`Request not found`);
    }

    if (request?.status != 'Pending') {
      throw new Error(
        'The request cannot be approved because it is not in Pending status',
      );
    }

    const updatedRequest = await this.prisma.request.update({
      where: {
        id,
      },
      data: {
        status: 'Approved',
      },
    });

    return {
      message: 'Request approved successfully',
      data: updatedRequest,
    };
  }
}
