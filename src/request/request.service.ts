import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
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
      
      if (error instanceof HttpException){
        throw error;
      }

      throw new BadRequestException('Invalid request data');

    }
  }
}
