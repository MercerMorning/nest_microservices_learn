import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {AccountLogin, AccountRegister} from "@purple/contracts";
import {RMQRoute, RMQValidate} from "nestjs-rmq";
import {JwtAuthGuard} from "../src/guards/jwt.guard";
import {UserId} from "../src/guards/user.decorator";

@Controller('user')
export class UserController {
  // constructor() {}
  //
  // @UseGuards(JwtAuthGuard)
  // @Post('info')
  // async info(@UserId() userId: string): Promise<AccountRegister.Response> {
  //
  // }
}


