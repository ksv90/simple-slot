import { IWorld, Orientation, randomElement } from '@game/base';
import { Container, PointData, Sprite } from 'pixi.js';
import { SpineBoy, Symbol, Reel } from './entities';

type GameEntity = { container: Container };

type Size = {
  readonly width: number;
  readonly height: number;
};

export interface IWorldProps {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly reelConfig: { num: number; position: PointData };
  readonly symbolConfig: Size & { available: number[] };
}

export class World implements IWorld {
  root = new Container({ label: 'root' });

  #bottomLayer = new Container({ label: 'bottom-layer' });

  #middleLayer = new Container({ label: 'middle-layer' });

  #topLayer = new Container({ label: 'top-layer' });

  #reelMap = new Map<number, Reel>();

  #entities = new Set<GameEntity>();

  #props: IWorldProps;

  constructor(props: IWorldProps) {
    const { canvasWidth, canvasHeight, reelConfig, symbolConfig } = props;

    this.#props = props;

    this.root.position.set(canvasWidth / 2, canvasHeight / 2);

    this.root.addChild(this.#bottomLayer, this.#middleLayer, this.#topLayer);

    this.#middleLayer.pivot.set((symbolConfig.width * reelConfig.num) / 2, 0);
    this.#middleLayer.position.set(reelConfig.position.x, reelConfig.position.y);
  }

  changeOrientation(value: Orientation): void {
    for (const _entity of this.#entities) {
      // update entity orientation
    }

    // hack, need data from config
    for (const spineBoy of this.getEntitiesByConstructor(SpineBoy)) {
      if (value === 'portrait') {
        spineBoy.container.position.set(0, -250);
      } else {
        spineBoy.container.position.set(-540, 420);
      }
    }
  }

  getRandomSymbolId(): number {
    const { symbolConfig } = this.#props;
    return randomElement(symbolConfig.available);
  }

  getEntitiesByConstructor<TEntity extends GameEntity>(Target: new (args: any) => TEntity): TEntity[] {
    const entities = new Array<TEntity>();
    for (const entity of this.#entities) {
      if (entity instanceof Target) {
        entities.push(entity);
      }
    }
    return entities;
  }

  addBottom(gameEntity: GameEntity) {
    this.#bottomLayer.addChild(gameEntity.container);
    this.#entities.add(gameEntity);
  }

  addTop(gameEntity: GameEntity) {
    this.#topLayer.addChild(gameEntity.container);
    this.#entities.add(gameEntity);
  }

  createScene(symbols: readonly number[]) {
    const { symbolConfig, reelConfig } = this.#props;

    for (let i = 0; i < symbols.length; i++) {
      const symbolId = symbols[i];
      const reelId = i % reelConfig.num;
      const reel = this.createReel(reelId);

      reel.container.position.set(reelId * symbolConfig.width + symbolConfig.width / 2, 0);
      reel.addSymbols(symbolId);

      this.#middleLayer.addChild(reel.container);
    }

    const mask = Sprite.from('mask');
    mask.label = 'reel-mask';
    mask.anchor.set(0.5, 0.5);
    mask.position.set(0, 114);
    this.#middleLayer.setMask({ mask });
    this.root.addChild(mask);
  }

  async spinStart(): Promise<void> {
    const promises = [];
    for (const [index, reel] of this.#reelMap) {
      promises.push(reel.reelStart(index / 10));
    }
    await Promise.all(promises);
  }

  spinBreak() {
    for (const [, reel] of this.#reelMap) {
      reel.reelBreak();
    }
  }

  async spinStop(symbols: readonly number[]): Promise<void> {
    const promises = [];
    for (const [index, reel] of this.#reelMap) {
      promises.push(reel.reelStop([symbols[index]]));
    }
    await Promise.all(promises);
  }

  createSymbol(id: number): Symbol {
    const symbol = new Symbol(this, {
      id,
      textures: { 1: 'cherry', 2: 'lemon', 3: 'plum' },
    });

    this.#entities.add(symbol);

    return symbol;
  }

  createReel(id: number): Reel {
    const { symbolConfig } = this.#props;
    const reel = new Reel(this, {
      id,
      speed: 0.2,
      bounce: 50,
      minRotation: 7,
      available: symbolConfig.available,
      symbolHeight: symbolConfig.height,
    });

    this.#entities.add(reel);
    this.#reelMap.set(id, reel);

    return reel;
  }
}
