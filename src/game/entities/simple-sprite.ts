import { Container, Sprite } from 'pixi.js';

export class SimpleSprite {
  #sprite: Sprite;

  constructor(spriteName: string) {
    this.#sprite = Sprite.from(spriteName);
    this.#sprite.anchor.set(0.5, 0.5);
  }

  get container(): Container {
    return this.#sprite;
  }
}
