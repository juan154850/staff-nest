import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestService } from './request.service';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async createRequest(@Body() createRequestDto: CreateRequestDto) {
    return await this.requestService.createRequest(createRequestDto);
  }

  @Get()
  async getAllRequests(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.requestService.getAllRequests(+page, +limit);
  }

  @Get(':id')
  async getAllRequestById(@Param('id') id: string) {
    return await this.requestService.getAllRequestById(id);
  }

  @Post(':id/approve')
  async approveRequest(@Param('id') id: string) {
    return await this.requestService.approveRequest(id);
  }

  @Post(':id/reject')
  async rejectRequest(@Param('id') id: string) {
    return await this.requestService.rejectRequest(id);
  }

  @Post(':id/cancel')
  async cancelRequest(@Param('id') id: string) {
    return await this.requestService.cancelRequest(id);
  }
}
