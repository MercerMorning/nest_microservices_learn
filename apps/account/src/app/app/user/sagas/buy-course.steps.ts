import {BuyCourseSagaState} from "./buy-course.state";
import {UserEntity} from "../entities/user.entity";
import {CourseGetCourse, PaymentCheck, PaymentGenerateLink} from "@purple/contracts";
import {PurchaseState} from "@purple/interfaces";

export class BuyCourseStepsStateStarted extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string, user: UserEntity}> {
    const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
      id: this.saga.courseId
    } )
    if (!course) {
      throw new Error('Course does not exist')
    }
    if (course.price == 0) {
      this.saga.setState( PurchaseState.Purchased, course._id)
      return { paymentLink: null, user: this.saga.user };
    }
    const { paymentLink } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(
      PaymentGenerateLink.topic,
      {
        courseId: course._id,
        userId: this.saga.user._id,
        sum: course.price
      }
    )
    this.saga.setState(PurchaseState.WaitingForPayment, course._id)
    return { paymentLink, user, this.saga.user}
  }
  public checkPayment(): Promise<{ user: UserEntity}> {
    throw new Error();
  }
  public async cancel(): Promise<{ user: UserEntity}> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return { user: this.saga.user }
  }
}


export class BuyCourseStepsStateProccess extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string, user: UserEntity}> {
    throw new Error();
  }
  public checkPayment(): Promise<{ user: UserEntity}> {
    const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    });
    if (status == 'canceled') {
      this.saga.setState(PurchaseState.Canceled, )
      return {user: this.saga.user}
    }
    if (status !== 'success') {
      return { user: this.saga.user }
    }
    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    return { user: this.saga.user }
  }
  public async cancel(): Promise<{ user: UserEntity}> {
    throw new Error();
  }
}

export class BuyCourseStepsStateFinished extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string, user: UserEntity}> {
    throw new Error();
  }
  public checkPayment(): Promise<{ user: UserEntity}> {
    throw new Error();
  }
  public async cancel(): Promise<{ user: UserEntity}> {
    throw new Error();
  }
}

export class BuyCourseStepsStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string, user: UserEntity}> {
    throw new Error();
  }
  public checkPayment(): Promise<{ user: UserEntity}> {
    throw new Error();
  }
  public async cancel(): Promise<{ user: UserEntity}> {
    throw new Error();
  }
}
