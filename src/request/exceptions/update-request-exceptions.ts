import { BadRequestException } from "@nestjs/common";

export class RequestNotPendingException extends BadRequestException {
  constructor() {
    super('The action cannot be performed because the request is not pending');
  }
}