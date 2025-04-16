import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UserMinimalDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;
}
