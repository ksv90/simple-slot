import { IReel, ISymbol, IWorld } from '@game/base';
import gsap from 'gsap';
import { Container } from 'pixi.js';

export type IReelOptions = {
  readonly id: number;
  readonly speed: number;
  readonly bounce: number;
  readonly minRotation: number;
  readonly available: number[];
  readonly symbolHeight: number;
};

export class Reel implements IReel {
  readonly container: Container;

  #world: IWorld;

  #options: IReelOptions;

  #spinTimeline?: gsap.core.Timeline;

  #break = false;

  #symbolList = new Array<ISymbol>();

  #nextSymbols = new Array<number>();

  constructor(world: IWorld, options: IReelOptions) {
    this.#world = world;
    this.#options = options;
    this.container = new Container({ label: `reel-${options.id + 1}` });
  }

  addSymbols(...symbolIds: number[]): void {
    const { symbolHeight } = this.#options;
    for (let index = -2; index <= symbolIds.length; index += 1) {
      const symbolId = symbolIds[index] ?? this.#world.getRandomSymbolId();
      const symbol = this.#world.createSymbol(symbolId);
      symbol.container.position.set(0, symbolHeight * index);
      this.#symbolList.push(symbol);
      this.container.addChild(symbol.container);
    }
  }

  async reelStart(delay: number): Promise<void> {
    const { speed, bounce, symbolHeight } = this.#options;
    const containers = this.#symbolList.map((symbol) => symbol.container);

    this.#break = false;

    this.#spinTimeline = gsap
      .timeline({ repeat: -1, repeatRefresh: true, paused: true })
      .call(this.#symbolUpdate)
      .to(containers, { duration: speed / 2, ease: 'none', pixi: { positionY: `+=${symbolHeight}` } });

    await gsap
      .timeline({ delay })
      .to(containers, { duration: speed, ease: 'power1.inOut', pixi: { positionY: `-=${bounce}` } })
      .to(containers, { duration: speed, ease: 'power1.in', pixi: { positionY: `+=${symbolHeight + bounce}` } });

    this.#spinTimeline.play();
  }

  async reelStop(symbols: number[]): Promise<void> {
    if (!this.#spinTimeline) {
      throw new Error('stop error');
    }

    const { speed, bounce, minRotation, symbolHeight } = this.#options;
    const containers = this.#symbolList.map((symbol) => symbol.container);

    const repeat = Math.max(this.#spinTimeline.iteration(), this.#break ? 1 : minRotation);

    this.#spinTimeline.repeat(repeat);

    await this.#spinTimeline;

    await gsap
      .timeline()
      .call(() => {
        this.#nextSymbols.push(...symbols);
      })
      .call(this.#symbolUpdate)
      .to(containers, { duration: speed / 2, ease: 'none', pixi: { positionY: `+=${symbolHeight}` } })
      .call(this.#symbolUpdate)
      .to(containers, { duration: speed, ease: 'power1.out', pixi: { positionY: `+=${symbolHeight + bounce}` } })
      .to(containers, { duration: speed, ease: 'power1.inOut', pixi: { positionY: `-=${bounce}` } })
      .call(this.#symbolUpdate);
  }

  reelBreak(): void {
    this.#break = true;
  }

  #symbolUpdate = () => {
    const { symbolHeight } = this.#options;
    const lastSymbol = this.#symbolList.pop()!;
    const symbolId = this.#nextSymbols.shift() ?? this.#world.getRandomSymbolId();
    lastSymbol.container.position.set(0, symbolHeight * -2);
    lastSymbol.setId(symbolId);
    this.container.addChildAt(lastSymbol.container, 0);
    this.#symbolList.unshift(lastSymbol);
  };
}
