// src/components/Button/Button.tsx
'use client';

import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  color?: string;
  onClick?: () => void;
  className?: string; // Para permitir estilos adicionales
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = 'bg-[#64B5F6]', // Un azul más llamativo por defecto
  onClick,
  className = '',
}) => {
  const buttonStyle = `text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${color} ${className}`;

  return (
    <button className={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;