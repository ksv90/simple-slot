import classes from './spin.module.css';

export interface ISpinProps {
  readonly spin: boolean;
  readonly onSpin: () => void;
  readonly onStop: () => void;
}

export function Spin({ spin, onSpin, onStop }: ISpinProps) {
  return (
    <div className={classes['spin']} onClick={spin ? onStop : onSpin}>
      {spin ? 'stop' : 'spin'}
    </div>
  );
}
