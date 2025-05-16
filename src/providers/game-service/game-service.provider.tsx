import { IGame } from '@game/base';

import { JSX, PropsWithChildren, useEffect, useMemo, useRef } from 'react';

import { IGameService, GameServiceContext } from './game-service.context';

export interface IGameServiceProviderProps {
  readonly game: IGame;
}

export const GameServiceProvider = (
  props: PropsWithChildren<IGameServiceProviderProps>,
): JSX.Element => {
  const { children, game } = props;

  const wrapRef = useRef<HTMLDivElement>(null);
  const gameService = useMemo<IGameService>(() => ({ game, wrapRef }), [game]);

  useEffect(() => {
    const readyHandler = () => {
      if (!game.canvas || !wrapRef.current) {
        throw new Error('непредвиденное состояние');
      }
      wrapRef.current.appendChild(game.canvas);
    };

    game.start();
    game.on('ready', readyHandler);

    return () => {
      game.on('ready', readyHandler);
      game.stop();
    };
  }, [game]);

  return (
    <GameServiceContext.Provider value={gameService}>
      {children}
    </GameServiceContext.Provider>
  );
};
