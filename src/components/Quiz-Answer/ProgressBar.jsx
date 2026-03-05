import React from 'react';
import styles from '../../css/ProgressBar.module.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className={styles.progressBar}>
      <div 
        className={styles.progressFill}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;