import { Expose, Type } from "class-transformer";
import { LeaveType, RequestStatus } from "@prisma/client";
import { UserMinimalDto } from "src/user/dto/user-minimal.dto";

export class RequestResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: LeaveType;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  @Expose()
  description: string;

  @Expose()
  status: RequestStatus;

  @Expose()
  @Type(() => UserMinimalDto)
  employee: UserMinimalDto;

  @Expose()
  @Type(() => UserMinimalDto)
  approver: UserMinimalDto;

}