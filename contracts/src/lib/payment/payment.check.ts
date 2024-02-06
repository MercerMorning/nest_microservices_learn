import {IsEmail, IsNumber, IsString} from 'class-validator';
import {ICourse, IUser} from "@purple/interfaces";

export namespace PaymentCheck {
  export const topic = 'payment.check.query'

  export class Request {
    @IsString()
    courseId: string;
    @IsString()
    userId: string;
  }

  export class Response {
    status: 'canceled' | 'success' | 'progress';
  }
}
