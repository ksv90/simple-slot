import { sound } from '@pixi/sound';
import { Context } from './context';
import { SpineBoy } from './entities';

export function spinStartAction(ctx: Context) {
  for (const spineBoy of ctx.world.getEntitiesByConstructor(SpineBoy)) {
    spineBoy.play('hoverboard');
  }
}

export function spinStopAction(ctx: Context) {
  for (const spineBoy of ctx.world.getEntitiesByConstructor(SpineBoy)) {
    spineBoy.play('idle');
  }
}

export function spinBreakAction(ctx: Context) {
  ctx.world.spinBreak();
}

export function showWinAction(ctx: Context) {
  for (const spineBoy of ctx.world.getEntitiesByConstructor(SpineBoy)) {
    spineBoy.play('jump', 'idle');
  }
}

export function showNoWinAction(ctx: Context) {
  for (const spineBoy of ctx.world.getEntitiesByConstructor(SpineBoy)) {
    spineBoy.play('death', 'idle');
  }
}

export function showBoyAction(ctx: Context) {
  for (const spineBoy of ctx.world.getEntitiesByConstructor(SpineBoy)) {
    spineBoy.play('portal', 'idle');
  }
}

export function playSoundAction(name: string) {
  return () => {
    if (sound.exists(name)) {
      sound.play(name);
    }
  };
}

export function stopSoundAction(name: string) {
  return () => {
    if (sound.exists(name)) {
      sound.stop(name);
    }
  };
}
