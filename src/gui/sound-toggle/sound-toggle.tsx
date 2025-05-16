import styles from './sound-toggle.module.css';

export interface ISoundToggleProps {
  readonly enabled: boolean;
  readonly onToggle: () => void;
}

export function SoundToggle(props: ISoundToggleProps) {
  const { enabled, onToggle } = props;

  return (
    <div className={styles.button} onClick={onToggle}>
      {enabled ? 'on' : 'off'}
    </div>
  );
}
