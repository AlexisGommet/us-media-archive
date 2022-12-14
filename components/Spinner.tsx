import type { FC } from 'react';
import styles from '../styles/Spinner.module.css';

const Spinner: FC = () => {
    return (
        <svg className={styles.spinner} fill="none" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle className={styles.path} strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
    )
}

export default Spinner;
