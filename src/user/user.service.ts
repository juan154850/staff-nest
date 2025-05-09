import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { paginate } from 'src/common/utils/pagination';
import { Prisma, User } from '@prisma/client';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { RequestResponseDto } from 'src/request/dto/request-response.dto';
import { FilterRequestsDto } from './dto/filter-requests.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      
      const {password, ...userData} = createUserDto;
      const hasedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hasedPassword,
        }
      });
      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.warn(`User already exists: ${error.meta?.target}`);
        throw new ConflictException(
          'A user with this data can not be created.',
        );
      }

      this.logger.error('Error creating company', error);
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) =>
      plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
  ): Promise<{
    data: UserResponseDto[];
    totalRecords: number;
    currentPage: number;
    lastPage: number;
    hasMorePages: boolean;
  }> {
    try {
      return await paginate<User, UserResponseDto>(
        Prisma.ModelName.User,
        this.prisma,
        page,
        limit,
        {},
        UserResponseDto,
      );
    } catch (error) {
      this.logger.error('Error fetching users', error);
      return {
        data: [],
        totalRecords: 0,
        currentPage: 0,
        lastPage: 0,
        hasMorePages: false,
      };
    }
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subordinates: {
          select: { id: true, fullName: true, email: true },
        },
        supervisor: {
          select: { id: true, fullName: true, email: true },
        },
        company: true,
      },
    });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async getMyRequests(
    userId: string,
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
        {
          where: {
            employeeId: userId,
          },
        },
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

  async getPendingRequests(
    userId: string,
    page: number,
    limit: number,
    filters: FilterRequestsDto,
  ): Promise<{
    data: RequestResponseDto[];
    totalRecords: number;
    currentPage: number;
    lastPage: number;
    hasMorePages: boolean;
  }> {
    try {
      const { startDate, endDate } = filters;
      const validEndDate =
        startDate && endDate && new Date(endDate) <= new Date(startDate)
          ? undefined
          : endDate;

      const where: Prisma.RequestWhereInput = {
        approverId: userId,
        ...(filters.startDate && {
          startDate: {
            gte: filters.startDate,
          },
        }),
        ...(validEndDate && {
          endDate: {
            lte: validEndDate,
          },
        }),
        ...(filters.employee && { employeeId: { in: filters.employee } }),
        ...(filters.type && { type: { in: filters.type } }),
        ...(filters.status && { status: { in: filters.status } }),
      };

      console.log('where', where);

      return await paginate<Request, RequestResponseDto>(
        Prisma.ModelName.Request,
        this.prisma,
        page,
        limit,
        {
          where,
          include: {
            employee: {
              select: { id: true, fullName: true, email: true },
            },
            approver: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
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
}
