import { OnEventOptions } from '../interfaces';
import { OnEvents } from './on-events.decorator';

/**
 * `@OnEvent` decorator metadata
 */
export interface OnEventMetadata {
  /**
   * Event (name or pattern) to subscribe to.
   */
  event: string | symbol | Array<string | symbol>;
  /**
   * Subscription options.
   */
  options?: OnEventOptions;
}

/**
 * `@OnEvent` decorator event type
 */
export type OnEventType = string | symbol | Array<string | symbol>;

/**
 * Event listener decorator.
 * Subscribes to events based on the specified name(s).
 *
 * @param event event to subscribe to
 */
export const OnEvent = (
  event: OnEventType,
  options?: OnEventOptions,
): MethodDecorator => OnEvents([event], options);
