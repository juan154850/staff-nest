import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CompanyDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
