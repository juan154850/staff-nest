import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { paginate } from 'src/common/utils/pagination';
import { Prisma, User } from '@prisma/client';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name);

  async create(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseDto | ConflictException> {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
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

  async findAll(): Promise<UserResponseDto[] | []> {
    try {
      const users = await this.prisma.user.findMany();

      if (!users) {
        return [];
      }

      return users.map((user) =>
        plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      this.logger.error('Error fetching users', error);
      return [];
    }
  }

  async findAllPaginated(page = 1, limit = 10) {
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
      return [];
    }
  }

  async findUserById(id: string):Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subordinates: true,
        supervisor: true,
        company: true,
      }
    });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
