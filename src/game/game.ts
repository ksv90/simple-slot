import { sound } from '@pixi/sound';
import { IGame, IGameEvents, Orientation } from '@game/base';
import { Emitter, IEmitter } from '@ksv90/decorators';
import { StateMachine, StateMachineConfig } from '@ksv90/fsm';

import { Context } from './context';
import { GameStateName, GameStateType } from './config';

export interface IGameOptions {
  context: Context;
  config: StateMachineConfig<GameStateName, GameStateType, Context>;
}

export interface Game extends IEmitter<IGameEvents> {}

@Emitter()
export class Game implements IGame {
  #initialized = false;

  #context: Context;

  #machine: StateMachine<GameStateName, GameStateType, Context>;

  #loadHandler = (progress: number) => {
    this.emit('loadProgress', progress * 100);
    if (progress !== 1) return;
    this.emit('loadComplete');
    this.#context.removeProgressHandler(this.#loadHandler);
  };

  constructor(options: IGameOptions) {
    this.#context = options.context;
    this.#machine = new StateMachine(options.config);

    this.#machine.on('entry', ({ stateName }) => {
      if (stateName === 'start') this.emit('spin');
      else if (stateName === 'stop') this.emit('stop');
    });
  }

  get canvas(): HTMLCanvasElement | null {
    if (!this.#initialized) return null;
    return this.#context.app.canvas;
  }

  start(): void {
    this.#context
      .init()
      .then(() => {
        this.#initialized = true;
        this.emit('ready');
        this.#context.addProgressHandler(this.#loadHandler);
        this.#machine.start();
        this.#context.start();
      })
      .catch((error) => this.emit('error', error));

    this.#machine.on('error', (error) => {
      this.emit('error', error);
    });

    this.toggleSound(false);
  }

  stop(): void {
    this.#initialized = false;
    this.#context.removeProgressHandler(this.#loadHandler);
    this.#context.stop();
    this.removeAllListeners();
  }

  next(): void {
    if (!this.#machine.hasEventType('NEXT')) return;
    this.#machine.transition('NEXT');
  }

  break(): void {
    if (!this.#machine.hasEventType('BREAK')) return;
    this.#machine.transition('BREAK');
  }

  setOrientation(value: Orientation): void {
    this.#context.orientation = value;
    this.emit('orientation', value);
  }

  toggleSound(enabled: boolean): void {
    if (enabled) sound.unmuteAll();
    else sound.muteAll();

    if (this.#context.soundLoaded || !enabled) return;

    this.#context.soundLoaded = true;

    this.#context.loadSound().catch((error) => {
      this.emit('error', error);
    });
  }
}
