import {UserEntity} from "../entities/user.entity";
import {RMQService} from "nestjs-rmq";
import {PurchaseState} from "@purple/interfaces";
import {BuyCourseSagaState} from "./buy-course.state";
import {
  BuyCourseStepsStateCanceled,
  BuyCourseStepsStateFinished,
  BuyCourseStepsStateProccess,
  BuyCourseStepsStateStarted
} from "./buy-course.steps";

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {

  }

  getState() {
    return this.state;
  }

  setState(state: PurchaseState, courseId: string) {
    switch (state) {
      case PurchaseState.Started:
        this.state = new BuyCourseStepsStateStarted()
        break;
      case PurchaseState.WaitingForPayment:
        this.state = new BuyCourseStepsStateProccess();
        break;
      case PurchaseState.Purchased:
        this.state = new BuyCourseStepsStateFinished();
        break;
      case PurchaseState.Canceled:
        this.state = new BuyCourseStepsStateCanceled();
        break;
    }
    this.state.setContext(this)
    // установка контекстк
    this.user.updateCourseStatus(courseId, state);
  }
}
