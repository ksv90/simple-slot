import { ISpineStateOptions, SpineState } from './spine.state';

const stateMap = {
  aim: 'aim',
  death: 'death',
  hoverboard: 'hoverboard',
  idle: 'idle',
  'idle-turn': 'idle',
  jump: 'jump',
  portal: 'portal',
  run: 'run',
  'run-to-idle': 'run',
  shoot: 'shoot',
  walk: 'walk',
};

export class SpineBoy extends SpineState<keyof typeof stateMap> {
  constructor(options: Pick<ISpineStateOptions<keyof typeof stateMap>, 'defaultMix'>) {
    super({ ...options, skeleton: 'spineboyData', atlas: 'spineboyAtlas', stateMap });
    this.container.label = `spineboy`;
  }
}
