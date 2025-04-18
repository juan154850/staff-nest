import { Body, Controller, Post } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestService } from './request.service';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async createRequest(@Body() createRequestDto: CreateRequestDto) {
    return await this.requestService.createRequest(createRequestDto);
  }
}
