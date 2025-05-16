import { useGameService, useWindowService } from '@game/providers';

import classes from './scene.module.css';
import { GameUI } from '../game-ui';
import { useEffect, useState } from 'react';
import { Preview } from '../preview/preview';

export function Scene() {
  const { game, wrapRef } = useGameService();
  const { orientation } = useWindowService();
  const [preview, setPreview] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    game.setOrientation(orientation);
  }, [orientation]);

  useEffect(() => {
    game.on('loadProgress', (progress) => {
      setProgress(Math.floor(progress));
    });
    game.once('loadComplete', () => {
      setLoaded(true);
    });
  }, [game]);

  const clickHandler = () => {
    setPreview(false);
    game.next();
  };

  return (
    <>
      {preview && <Preview progress={progress} onClick={loaded ? clickHandler : undefined} />}
      <div className={preview ? classes['hide'] : ''}>
        <div ref={wrapRef} className={classes['game']} />
        <GameUI />
      </div>
    </>
  );
}
