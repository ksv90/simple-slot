import styles from './preview.module.css';

export interface IPreviewProps {
  readonly progress: number;
  readonly onClick?: () => void;
}

export function Preview({ progress, onClick }: IPreviewProps) {
  return (
    <div className={styles['wrap']}>
      <div className={styles['container']}>
        <div className={styles['progressBar']}>
          <div className={styles['progressFill']} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles['progressText']}>{progress}%</p>
        <button disabled={!onClick} className={styles['button']} onClick={onClick}>
          continue
        </button>
      </div>
    </div>
  );
}
