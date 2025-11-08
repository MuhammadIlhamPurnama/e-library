import React from 'react'

const GlobalButton = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...rest
}) => {
  const baseClasses = 'cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg px-6 py-3'
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed hover:bg-blue-600 active:bg-blue-600' : ''
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${disabledClasses} ${className}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default GlobalButton