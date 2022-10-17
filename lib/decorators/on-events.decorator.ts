import { OnEventOptions } from '../interfaces';
import { OnEventMetadata, OnEventType } from './on-event.decorator';
import { extendArrayMetadata } from '@nestjs/common/utils/extend-metadata.util';
import { EVENT_LISTENER_METADATA } from '../constants';

/**
 * Event listener decorator.
 * Subscribes to array of events based on the specified name(s).
 *
 * @param events array of events to subscribe to
 */
export const OnEvents = (
  events: OnEventType[],
  options?: OnEventOptions,
): MethodDecorator => {
  const decoratorFactory = (target: object, key?: any, descriptor?: any) => {
    extendArrayMetadata(
      EVENT_LISTENER_METADATA,
      events.map(event => ({ event, options } as OnEventMetadata)),
      descriptor.value,
    );
    return descriptor;
  };
  decoratorFactory.KEY = EVENT_LISTENER_METADATA;
  return decoratorFactory;
};
