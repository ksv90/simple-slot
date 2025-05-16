import { IGame } from '@game/base';

import { createContext, RefObject, useContext } from 'react';

export interface IGameService {
  get game(): IGame;
  get wrapRef(): RefObject<HTMLDivElement>;
}

export const GameServiceContext = createContext<IGameService | null>(null);

export const useGameService = (): IGameService => {
  const gameService = useContext(GameServiceContext);
  if (!gameService) {
    throw new Error('gameService не определен');
  }
  return gameService;
};
