// src/components/Form_Field/Form_Field.tsx
import React, { ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children }) => {
  return (
    <div className={styles.formField}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
};