import { useEffect, useMemo } from 'react';

import './app.css';

import { GameServiceProvider, WindowServiceProvider } from '@game/providers';
import { Context, createMachineConfig, Game } from '../game';

import { Scene } from '../gui';

export function App() {
  const context = useMemo(() => new Context(), []);
  const config = useMemo(() => createMachineConfig(context), [context]);
  const game = useMemo(() => new Game({ context, config }), [context, config]);

  useEffect(() => {
    game.on('error', (error) => {
      console.error('Game error:', error);
    });
  }, [game]);

  return (
    <WindowServiceProvider>
      <GameServiceProvider game={game}>
        <Scene />
      </GameServiceProvider>
    </WindowServiceProvider>
  );
}
