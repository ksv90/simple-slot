import { getResponseData } from '@game/base';
import { Assets } from 'pixi.js';
import { Context } from './context';
import { SimpleSprite, SpineBoy } from './entities';

export function initJob() {
  return async (ctx: Context) => {
    await Assets.init({ manifest: './manifest.json' });
    const { symbols } = (await getResponseData('/mock-server/api/init')) as { symbols: number[] }; // validate
    ctx.setRoundData({ symbols, win: false });
  };
}

export function loadBundleJob(bundleName: string) {
  return async (ctx: Context) => {
    await Assets.loadBundle(bundleName, (progress) => {
      ctx.setProgress(progress);
    });
  };
}

export function createSceneJob() {
  return (ctx: Context) => {
    const { world } = ctx;

    const symbols = ctx.getNextSymbols();
    world.createScene(symbols);

    world.addBottom(new SimpleSprite('background'));
    world.addBottom(new SimpleSprite('playground'));

    const spineBoy = new SpineBoy({ defaultMix: 0.2 });

    if (ctx.orientation === 'portrait') {
      spineBoy.container.position.set(0, -250);
    } else {
      spineBoy.container.position.set(-540, 420);
    }

    world.addTop(spineBoy);
  };
}

export function spinStartJob() {
  return async (ctx: Context) => {
    await ctx.world.spinStart();
  };
}

export function waitResponseJob() {
  return async (ctx: Context) => {
    const { symbols, win } = (await getResponseData('/mock-server/api/spin')) as { symbols: number[]; win: boolean }; // validate
    ctx.setRoundData({ symbols, win });
  };
}

export function spinStopJob() {
  return async (ctx: Context) => {
    const symbols = ctx.getNextSymbols();
    await ctx.world.spinStop(symbols);
  };
}
