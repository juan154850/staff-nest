import { LeaveType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateRequestDto {
  @IsEnum(LeaveType)
  type: LeaveType;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsUUID("4")
  employeeId: string;

  @IsUUID("4")
  approverId: string;
}
