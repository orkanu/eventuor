interface EventuorEvents {
  [key: string]: any[];
}

export interface EventuorInterface {
  events: EventuorEvents;
  on(name: string, cb: Function): () => void;
  off(name: string, cb: Function): void;
  once(name: string, cb: Function): void;
  emit(name: string, ...args: any[]): void;
}

/**
* Simple event emitter class
*/
export default class Eventuor implements EventuorInterface {
  public events: EventuorEvents;
  constructor(events?: EventuorEvents) {
      this.events = events || {};
  }

  on(name: string, cb: Function) {
    (this.events[name] || (this.events[name] = [])).push(cb);

    return () => this.off(name, cb);
  }

  off(name: string, cb: Function) {
    this.events[name] && (this.events[name] = this.events[name].filter(callback => callback !== cb));
    // this.events[name] && this.events[name].splice(this.events[name].indexOf(cb) >>> 0, 1)
  }

  once(name: string, cb: Function) {
    const wrappedCB = (...args: any[]) => {
      cb(...args);
      this.off(name, wrappedCB);
    }
    this.on(name, wrappedCB);
  }

  emit(name: string, ...args: any[]) {
    (this.events[name] || (this.events[name] = [])).forEach(cb => cb(...args));
  }
}

interface EventuorPollInterface {
  timeout: number;
}

interface EventuorPollConfig {
  events?: EventuorEvents
  timeout?: number
}
/**
* Convenient class to have polling events
*/
export class EventuorPoll extends Eventuor implements EventuorPollInterface {
  public timeout: number;
  constructor({ events, timeout = 5000 }: EventuorPollConfig) {
    super(events);
    this.timeout = timeout;
  }
  
  poll(name: string, ...args: any[]) {
    const tm = setInterval(() => this.emit(name, ...args), this.timeout);
    return () => clearInterval(tm);
  }
  
  onPoll(name: string, cb: Function) {
    return this.on(name, cb);
  }
}