// src/components/Form_Field/Form_Field.tsx
import React, { ReactNode, ReactElement } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  children, 
  error,
  className = ''
}) => {
  // Clone children to add error class if needed
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<{ className?: string }>(child)) {
      return React.cloneElement(child as ReactElement<{ className?: string }>, {
        className: `${child.props.className || ''} ${error ? styles.hasError : ''}`
      });
    }
    return child;
  });

  return (
    <div className={`${styles.formField} ${className}`}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        {childrenWithProps}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default FormField;