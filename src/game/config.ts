import { StateMachineConfig } from '@ksv90/fsm';

import { Context } from './context';
import { createSceneJob, loadBundleJob, initJob, spinStartJob, spinStopJob, waitResponseJob } from './jobs';
import {
  showNoWinAction,
  showWinAction,
  spinBreakAction,
  spinStartAction,
  spinStopAction,
  playSoundAction,
  stopSoundAction,
  showBoyAction,
} from './actions';

export type GameStateName = 'init' | 'loading' | 'preview' | 'idle' | 'start' | 'wait' | 'stop';

export type GameStateType = 'NEXT' | 'COMPLETE' | 'BREAK';

export function createMachineConfig<TContext extends Context>(
  context: TContext,
): StateMachineConfig<GameStateName, GameStateType, TContext> {
  return {
    context,
    initState: 'init',
    states: {
      init: {
        emit: [{ eventType: 'COMPLETE' }],
        on: {
          COMPLETE: [{ target: 'loading' }],
        },
        job: initJob(),
      },
      loading: {
        emit: [{ eventType: 'COMPLETE' }],
        on: {
          COMPLETE: [{ target: 'preview' }],
        },
        job: loadBundleJob('game-assets'),
      },
      preview: {
        exit: [showBoyAction],
        on: {
          NEXT: [{ target: 'idle' }],
        },
        job: createSceneJob(),
      },
      idle: {
        on: {
          NEXT: [{ target: 'start' }],
        },
      },
      start: {
        entry: [playSoundAction('spin'), spinStartAction],
        emit: [{ eventType: 'COMPLETE' }],
        on: {
          COMPLETE: [{ target: 'wait' }],
          BREAK: [{ actions: [spinBreakAction] }],
        },
        job: spinStartJob(),
      },
      wait: {
        emit: [{ eventType: 'COMPLETE' }],
        on: {
          COMPLETE: [{ target: 'stop' }],
          BREAK: [{ actions: [spinBreakAction] }],
        },
        job: waitResponseJob(),
      },
      stop: {
        exit: [spinStopAction, stopSoundAction('spin')],
        emit: [{ eventType: 'COMPLETE' }],
        on: {
          COMPLETE: [
            { cond: (ctx) => ctx.getWin(), actions: [playSoundAction('win'), showWinAction], target: 'idle' },
            { cond: (ctx) => ctx.checkLossSeries(), actions: [showNoWinAction], target: 'idle' },
            { target: 'idle' },
          ],
        },
        job: spinStopJob(),
      },
    },
  };
}
