import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  onClick, 
  disabled = false,
  loading = false
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-sm',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
