import { BadRequestException } from '@nestjs/common';

export class RequestDateInPastException extends BadRequestException {
  constructor() {
    super('Start date must be in the future');
  }
}

export class RequestEndBeforeStartException extends BadRequestException {
  constructor() {
    super('End date must be after start date');
  }
}

export class OverlappingRequestException extends BadRequestException {
  constructor() {
    super('You already have a request in that period');
  }
}
