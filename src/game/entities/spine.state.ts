import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { Container } from 'pixi.js';

export interface ISpineStateOptions<TStateName extends string> {
  atlas: string;
  skeleton: string;
  stateMap: Record<TStateName, string>;
  defaultMix?: number;
}

export class SpineState<TStateName extends string> {
  #stateName: TStateName | null = null;

  readonly #spine: Spine;

  readonly #options: ISpineStateOptions<TStateName>;

  constructor(options: ISpineStateOptions<TStateName>) {
    this.#options = options;

    this.#spine = Spine.from({
      skeleton: options.skeleton,
      atlas: options.atlas,
    });

    this.#spine.state.data.defaultMix = options.defaultMix ?? 0.5;
    this.#spine.visible = false;
  }

  get stateName(): TStateName | null {
    return this.#stateName;
  }

  get container(): Container {
    return this.#spine;
  }

  play(stateName: TStateName, ...stateNames: TStateName[]): void {
    if (stateName === this.#stateName) return;

    const animationName = this.#getAnimationName(stateName);

    this.#stateName = stateName;
    this.#spine.visible = true;

    this.#spine.state.setAnimation(0, animationName, !stateNames.length);

    for (const [index, nextStateName] of stateNames.entries()) {
      const nextAnimationName = this.#getAnimationName(nextStateName);
      const trackEntry = this.#spine.state.addAnimation(0, nextAnimationName, !stateNames[index + 1]);
      trackEntry.listener = {
        start: () => {
          this.#stateName = nextStateName;
        },
      };
    }
  }

  stop(): void {
    this.#stateName = null;
    this.#spine.visible = false;
    this.#spine.state.clearTracks();
    this.#spine.skeleton.setToSetupPose();
  }

  #getAnimationName(stateName: TStateName): string {
    const { stateMap } = this.#options;
    return stateMap[stateName];
  }
}
