import classes from './game-ui.module.css';
import { useGameService } from '@game/providers';
import { useEffect, useState } from 'react';
import { Spin } from '../spin';
import { SoundToggle } from '../sound-toggle';

export function GameUI() {
  const { game } = useGameService();
  const [spin, setSpin] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const spinStartHandler = () => {
      setSpin(true);
    };
    const spinStopHandler = () => {
      setSpin(false);
    };
    game.on('spin', spinStartHandler);
    game.on('stop', spinStopHandler);

    return () => {
      game.off('spin', spinStartHandler);
      game.off('stop', spinStopHandler);
    };
  }, [game]);

  useEffect(() => {
    game.toggleSound(enabled);
  }, [enabled]);

  const spinHandler = () => {
    game.next();
  };

  const stopHandler = () => {
    game.break();
  };

  const toggleHandler = () => {
    setEnabled((prev) => !prev);
  };

  return (
    <div className={classes['ui']}>
      <div className={classes['buttons']}>
        <Spin spin={spin} onSpin={spinHandler} onStop={stopHandler} />
        <SoundToggle enabled={enabled} onToggle={toggleHandler} />
      </div>
    </div>
  );
}
