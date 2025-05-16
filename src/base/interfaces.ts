import { Container } from 'pixi.js';
import { IEmitterLite, Orientation } from './types';

export interface IGameEvents {
  ready: [];
  error: [Error];
  loadProgress: [number];
  loadComplete: [];
  orientation: [Orientation];
  spin: [];
  stop: [];
}

export interface IGame extends IEmitterLite<IGameEvents> {
  get canvas(): HTMLCanvasElement | null;
  start(): void;
  stop(): void;
  next(): void;
  break(): void;
  setOrientation(value: Orientation): void;
  toggleSound(enabled: boolean): void;
}

export interface ISymbol {
  get container(): Container;
  setId(id: number): void;
}

export interface IReel {
  addSymbols(...symbolIds: number[]): void;
}

export interface IWorld {
  getRandomSymbolId(): number;
  createSymbol(id: number): ISymbol;
  createReel(id: number): IReel;
  changeOrientation(value: Orientation): void;
}
