import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
// import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, Prisma } from '@prisma/client';
import { paginate } from 'src/common/utils/pagination';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {

  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(CompanyService.name);

  async findAll(): Promise<Company[]> {
    const companies = await this.prisma.company.findMany();
    return companies;
  }

  async findAllPaginated(page = 1, limit = 10) {
    return paginate<Company>(Prisma.ModelName.Company, this.prisma, page, limit);
  }

  async findOne(id: string): Promise<Company | NotFoundException> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      
      return await this.prisma.company.create({
        data: createCompanyDto,
      });

    } catch (error) {
      
      if (error.code === 'P2002') { // Prisma unique constraint failed
        this.logger.warn(`Company already exists: ${error.meta?.target}`);
        throw new ConflictException('A company with this email already exists.');
      }

      this.logger.error('Error creating company', error);
      throw error;

    }
  }

  // update(id: number, updateCompanyDto: UpdateCompanyDto) {
  //   return `This action updates a #${id} company`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} company`;
  // }
}
