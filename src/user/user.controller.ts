import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import {
  FilteredPaginationDto,
  FilterRequestsDto,
} from './dto/filter-requests.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto | ConflictException> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    return await this.userService.findAllPaginated(+page, +limit);
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Get(':userId/my-request')
  async getMyRequests(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.userService.getMyRequests(userId, +page, +limit);
  }

  @Get(':userId/pending-request')
  async getPendingRequests(
    @Param('userId') userId: string,
    @Query() query: FilteredPaginationDto,
  ) {
    const { page, limit, ...filters } = query;

    return await this.userService.getPendingRequests(
      userId,
      +page,
      +limit,
      filters,
    );
  }
}
