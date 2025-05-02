import { LeaveType, RequestStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterRequestsDto {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsUUID('4', { each: true })
  employee?: string[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsEnum(LeaveType, { each: true })
  type?: LeaveType[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsEnum(RequestStatus, { each: true })
  status?: RequestStatus[];
}

export class FilteredPaginationDto extends IntersectionType(
  PaginationDto,
  FilterRequestsDto,
) {}
