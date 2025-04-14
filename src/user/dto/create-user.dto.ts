import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

enum Role {
  admin = "admin",
  user = "user",
  moderator = "moderator",
}

enum Status {
  active = "active",
  inactive = "inactive",
  suspended = "suspended",
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.user;

  @IsEnum(Status)
  @IsOptional()
  status: Status = Status.active;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  companyId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  respondsToId?: string;
}
