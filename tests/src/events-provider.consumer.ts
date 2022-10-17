import { Injectable } from '@nestjs/common';
import { OnEvent, OnEvents } from '../../lib';

@Injectable()
export class EventsProviderConsumer {
  public eventPayload = {};
  public stackedEventCalls = 0;
  public stackedDecoratorCalls = 0;

  @OnEvent('test.*')
  onTestEvent(payload: Record<string, any>) {
    this.eventPayload = payload;
  }

  @OnEvent('stacked1.*')
  @OnEvent('stacked2.*')
  onStackedEvent() {
    this.stackedEventCalls++;
  }

  @OnEvents(['stacked1.*', 'stacked2.*'])
  onStackedDecorator() {
    this.stackedDecoratorCalls++;
  }
}
