import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EventEmitter2 } from 'eventemitter2';
import { AppModule } from '../src/app.module';
import { EventsControllerConsumer } from '../src/events-controller.consumer';
import { EventsProviderPrependConsumer } from '../src/events-provider-prepend.consumer';
import { EventsProviderConsumer } from '../src/events-provider.consumer';
import { EventsProviderRequestScopedConsumer } from '../src/events-provider.request-scoped.consumer';
import { TEST_PROVIDER_TOKEN } from '../src/test-provider';

describe('EventEmitterModule - e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
  });

  it(`should emit a "test-event" event to providers`, async () => {
    const eventsConsumerRef = app.get(EventsProviderConsumer);
    await app.init();

    expect(eventsConsumerRef.eventPayload).toEqual({ test: 'event' });
  });

  it(`should emit a "test-event" event to controllers`, async () => {
    const eventsConsumerRef = app.get(EventsControllerConsumer);
    await app.init();

    expect(eventsConsumerRef.eventPayload).toEqual({ test: 'event' });
  });

  it('should be able to specify a consumer be prepended via OnEvent decorator options', async () => {
    const eventsConsumerRef = app.get(EventsProviderPrependConsumer);
    const prependListenerSpy = jest.spyOn(
      app.get(EventEmitter2),
      'prependListener',
    );
    await app.init();

    expect(eventsConsumerRef.eventPayload).toEqual({ test: 'event' });
    expect(prependListenerSpy).toHaveBeenCalled();
  });

  it('should work with null prototype provider value', async () => {
    const moduleWithNullProvider = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TEST_PROVIDER_TOKEN)
      .useFactory({
        factory: () => {
          const testObject = { a: 13, b: 7 };
          Object.setPrototypeOf(testObject, null);
          return testObject;
        },
      })
      .compile();
    app = moduleWithNullProvider.createNestApplication();
    await expect(app.init()).resolves.not.toThrow();
  });

  it('should be able to emit a request-scoped event with a single payload', async () => {
    await app.init();

    expect(EventsProviderRequestScopedConsumer.injectedEventPayload).toEqual({
      test: 'event',
    });
  });

  it('should be able to emit a request-scoped event with a string payload', async () => {
    await app.init();

    expect(
      EventsProviderRequestScopedConsumer.injectedEventStringPayload,
    ).toEqual('some-string');
  });

  it('should be able to emit a request-scoped event with multiple payloads', async () => {
    await app.init();

    expect(
      EventsProviderRequestScopedConsumer.injectedEventMultiPayload,
    ).toEqual([
      {
        test: 'event',
      },
      {
        test2: 'event2',
      },
    ]);
  });

  afterEach(async () => {
    await app.close();
  });
});
