import styles from './Switch.module.scss';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}

export const Switch = ({ checked, onChange, tooltip }: SwitchProps) => {
  return (
    <div className={styles.tooltipWrapper}>
      <button
        className={`${styles.switch} ${checked ? styles.checked : ''}`}
        onClick={() => onChange(!checked)}
      >
        <div className={styles.knob} />
      </button>
      {tooltip && <span className={styles.tooltip}>{tooltip}</span>}
    </div>
  );
};
