import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
// import { UpdateCompanyDto } from './dto/update-company.dto';
import { NotFoundException } from '@nestjs/common';
import { Company } from '@prisma/client';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    return this.companyService.findAllPaginated(+page, +limit);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Company | NotFoundException> {
    return this.companyService.findOne(id);
  }

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company | NotFoundException> {
    const createdCompany = await this.companyService.create(createCompanyDto);
    if (!createdCompany) {
      throw new NotFoundException('The company could not be created');
    }
    return createdCompany;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companyService.update(+id, updateCompanyDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.companyService.remove(+id);
  // }
}
