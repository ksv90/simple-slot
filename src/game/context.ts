import { Orientation } from '@game/base';
import { sound } from '@pixi/sound';

import * as PIXI from 'pixi.js';
import { Application, Assets, ProgressCallback } from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

import { ResizeManager, ResizeManagerConfig } from './resize-manager';
import { World, IWorldProps } from './world';

gsap.registerPlugin(PixiPlugin);
gsap.defaults({ ease: 'none' });

PixiPlugin.registerPIXI(PIXI);

declare global {
  var __PIXI_APP__: Application;
}

export class Context {
  app: Application;

  world: World;

  soundLoaded = false;

  #resizeManager: ResizeManager;

  #orientation: Orientation = 'landscape';

  #store: {
    win: boolean;
    symbols: readonly number[];
    lossSeries: number;
  };

  #progressHandlerList = new Set<ProgressCallback>();

  #props: ResizeManagerConfig & IWorldProps = {
    canvasWidth: 1920,
    canvasHeight: 1920,
    contentWidth: 1080,
    contentHeight: 1080,
    aspectRatio: {
      width: 16,
      height: 9,
    },
    reelConfig: {
      num: 3,
      position: { x: 0, y: 110 },
    },
    symbolConfig: { width: 240, height: 320, available: [1, 2, 3] },
  };

  constructor() {
    this.app = new Application();
    this.#resizeManager = new ResizeManager(this.app, this.#props);
    this.world = new World(this.#props);
    this.#store = {
      win: false,
      symbols: [],
      lossSeries: -1,
    };

    this.app.stage.addChild(this.world.root);

    globalThis.__PIXI_APP__ = this.app;
  }

  get orientation(): Orientation {
    return this.#orientation;
  }

  set orientation(value: Orientation) {
    this.#orientation = value;
    this.world.changeOrientation(value);
  }

  async init(): Promise<void> {
    await this.app.init();
  }

  async start(): Promise<void> {
    this.#resizeManager.start();
  }

  stop(): void {
    this.#resizeManager.stop();
    this.app.destroy(true, { children: true });
  }

  async loadSound(): Promise<void> {
    await Assets.loadBundle('game-sounds');
    sound.play('ambient', { loop: true });
  }

  addProgressHandler(cb: ProgressCallback) {
    this.#progressHandlerList.add(cb);
  }

  removeProgressHandler(cb: ProgressCallback) {
    this.#progressHandlerList.delete(cb);
  }

  setProgress(progress: number): void {
    for (const handler of this.#progressHandlerList) {
      handler(progress);
    }
  }

  setRoundData({ win, symbols }: { win: boolean; symbols: readonly number[] }) {
    this.#store.win = win;
    this.#store.symbols = symbols;
    this.#store.lossSeries = win ? 0 : this.#store.lossSeries + 1;
  }

  getNextSymbols(): number[] {
    const { symbols } = this.#store;
    this.#store.symbols = [];
    return [...symbols];
  }

  getWin(): boolean {
    const { win } = this.#store;
    return win;
  }

  checkLossSeries(): boolean {
    const { lossSeries } = this.#store;
    if (lossSeries < 3) return false;
    this.#store.lossSeries = 0;
    return true;
  }
}
