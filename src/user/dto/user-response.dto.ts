import { Exclude, Expose } from 'class-transformer';

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

  @Expose()
  companyId?: string;

  @Expose()
  respondsToId?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
