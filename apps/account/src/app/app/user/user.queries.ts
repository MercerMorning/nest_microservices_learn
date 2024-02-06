import {Body, Controller} from "@nestjs/common";
import {RMQRoute, RMQValidate} from "nestjs-rmq";
import {AccountGetInfo, AccountRegister, AccountUserCourses} from "@purple/contracts";
import {UserRepository} from "./repositories/user.repository";
import {UserEntity} from "./entities/user.entity";


@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {
  }
  @RMQValidate()
  @RMQRoute(AccountGetInfo.topic)
  async userInfo(@Body() { id }:AccountGetInfo.Request ): Promise<AccountGetInfo.Response> {
    const user = await this.userRepository.findUserById(id)
    const profile = new UserEntity(user).getUserPublicProfile();
    return {
      profile: user
    };
  }

  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  async userCourses(@Body() { id }:AccountUserCourses.Request ): Promise<AccountUserCourses.Response> {
    const user = await this.userRepository.findUserById(id)
    return {
      courses: user.courses
    };
  }
}


