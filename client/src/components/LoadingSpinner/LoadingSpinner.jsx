import Lottie from "lottie-react";
import styles from './LoadingSpinner.module.css';
import loadingAnim from './loading.json';

export default function LoadingSpinner() {
    return (
        <div className={styles.spinnerWrapper}>
            <Lottie animationData={loadingAnim} loop />
        </div>
    );
}