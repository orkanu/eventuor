import Eventuor, { EventuorPoll } from './eventuor';

describe('Even emitters', () => {
  describe('Eventuor', () => {
    const EMPTY_CB = () => {};
    describe('ctor', () => {
        test('should use events passed in contructor', () => {
          const events = {};
          const testee = new Eventuor(events);
          expect(testee.events).toBe(events);
        });
        test('should default events to empty object when none is passed', () => {
          const events = {};
          const testee = new Eventuor();
          expect(testee.events).not.toBeUndefined();
          expect(testee.events).toEqual(events);
        });
    });
  
    describe('on', () => {
      test('should register callback for event', () => {
        const testee = new Eventuor({});
        testee.on('MyEvent', () =>{});
        expect(testee.events['MyEvent'].length).toBe(1);
      });
      test('should register callbacks for same event', () => {
        const eventName = 'MyEvent';
        const testee = new Eventuor({});
        testee.on(eventName, EMPTY_CB);
        testee.on(eventName, EMPTY_CB);
        expect(testee.events[eventName].length).toBe(2);
      });
      test('should return function to unsubscribe', () => {
        const testee = new Eventuor({});
        const unsubsFN = testee.on('MyEvent', () =>{});
        expect(unsubsFN).not.toBeUndefined();
        expect(typeof unsubsFN).toBe("function");
        expect(testee.events['MyEvent'].length).toBe(1);
        unsubsFN();
        expect(testee.events['MyEvent'].length).toBe(0);
      });
    });
    describe('off', () => {
      test('should do nothing if event to unsubscribe does not exist', () => {
        const testee = new Eventuor({});
        expect(testee.off('MyEvent', EMPTY_CB)).toBe(undefined);
      });
      test('should unsubscribe callback stored for an event', () => {
        const eventName = 'MyEvent';
        const testee = new Eventuor({});
        testee.on(eventName, EMPTY_CB);
        expect(testee.events[eventName].length).toBe(1);
        testee.off(eventName, EMPTY_CB);
        expect(testee.events[eventName].length).toBe(0);
      });
    });
    describe('once', () => {
      test('should call callback stored for an event and unsubscribe', () => {
        const mockCallback = jest.fn();
        const testee = new Eventuor({});
        testee.once('MyEvent', mockCallback);
        testee.emit('MyEvent', 'arg1', 'arg2');
        expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
        expect(testee.events['MyEvent'].length).toBe(0);
      });
    });
    describe('emit', () => {
      test('should do nothing if event to emit does not exist', () => {
        const testee = new Eventuor({});
        expect(testee.emit('MyEvent', 'arg1', 'arg2')).toBe(undefined);
      });
      test('should call callback stored for an event', () => {
        const mockCallback = jest.fn();
        const testee = new Eventuor({});
        testee.on('MyEvent', mockCallback);
        testee.emit('MyEvent', 'arg1', 'arg2');
        expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
        expect(testee.events['MyEvent'].length).toBe(1);
      });
    });
  });
  describe('EventuorPoll', () => {
    test('should emit event until timeout reached', (done) => {
      const testee = new EventuorPoll({ events: {}, timeout: 100 });
      let count = 0;
      testee.onPoll('MyPollEvent', (...args: any[]) => count += args[0]);
      const clearPoll = testee.poll('MyPollEvent', 1);
      setTimeout(() => {
        expect(count).toBe(5);
        clearPoll();
        done();
      }, 550);
    });
    test('should allow to stop polling', (done) => {
      const testee = new EventuorPoll({ events: {}, timeout: 10 });
      let count = 0;
      testee.onPoll('MyPollEvent', (...args: any[]) => count += args[0]);
      const clearPoll = testee.poll('MyPollEvent', 1);
      clearPoll();
      setTimeout(() => {
        expect(count).toBe(0);
        done();
      }, 200);
    });
  });
});
