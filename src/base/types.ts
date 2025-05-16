export type Orientation = 'landscape' | 'portrait';

export type Listener<TData extends unknown[]> = (...eventData: TData) => void;

export type EmitterEvents<TEvents> = Record<keyof TEvents, unknown[]>;

export interface IEmitterLite<TEvents extends EmitterEvents<TEvents>> {
  on<TEventName extends keyof TEvents>(eventName: TEventName, listener: Listener<TEvents[TEventName]>): this;
  once<TEventName extends keyof TEvents>(eventName: TEventName, listener: Listener<TEvents[TEventName]>): this;
  off<TEventName extends keyof TEvents>(eventName: TEventName, listener: Listener<TEvents[TEventName]>): this;
}
