import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function ProgressBar({
  percentage,
  showLabel = true,
  size = 'medium',
  color = '#f97316'
}: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`${styles.progressContainer} ${styles[size]}`}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: color
          }}
        >
          {showLabel && clampedPercentage > 15 && (
            <span className={styles.progressLabel}>
              {Math.round(clampedPercentage)}%
            </span>
          )}
        </div>
      </div>
      {showLabel && clampedPercentage <= 15 && (
        <span className={styles.progressLabelOutside}>
          {Math.round(clampedPercentage)}%
        </span>
      )}
    </div>
  );
}
