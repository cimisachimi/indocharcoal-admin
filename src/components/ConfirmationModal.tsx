// src/components/ConfirmationModal.tsx
import styles from '../app/global.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.buttonSecondary}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.deleteButton}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}