import { Exclude, Expose, Type } from 'class-transformer';
import { CompanyDto } from 'src/company/dto/company.dto';
import { UserMinimalDto } from './user-minimal.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  phone?: string;

  @Expose()
  role: string;

  @Expose()
  status: string;

  @Expose()
  position: string;

  @Exclude()
  companyId?: string;

  @Exclude()
  respondsToId?: string;

  @Expose()
  @Type(() => CompanyDto)
  company?: CompanyDto;

  @Expose()
  @Type(() => UserMinimalDto)
  supervisor?: UserMinimalDto;

  @Expose()
  @Type(() => UserMinimalDto)
  subordinates?: UserMinimalDto[];
}
