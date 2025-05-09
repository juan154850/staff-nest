import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    const { password, ...result } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const { password, ...userData } = createUserDto;
      const hasedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hasedPassword,
        },
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
}
