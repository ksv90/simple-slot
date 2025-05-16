import { ISymbol, IWorld } from '@game/base';
import { Container, ContainerChild, Sprite, Texture } from 'pixi.js';

export interface ISymbolOptions {
  id: number;
  textures: Record<number, string>;
}

export class Symbol implements ISymbol {
  readonly #options: ISymbolOptions;

  readonly #sprite: Sprite;

  // readonly #world: IWorld;

  constructor(_world: IWorld, options: ISymbolOptions) {
    this.#options = options;
    // this.#world = world;
    this.#sprite = new Sprite();
    this.#sprite.anchor.set(0.5, 0.5);

    this.setId(options.id);
  }

  get container(): Container<ContainerChild> {
    return this.#sprite;
  }

  setId(id: number) {
    const { textures } = this.#options;
    this.#options.id = id;
    this.#sprite.label = `symbol ${id}`;
    this.#sprite.texture = Texture.from(textures[id]);
  }
}
