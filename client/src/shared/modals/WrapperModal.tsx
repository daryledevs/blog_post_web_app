import React from 'react'

type WrapperModalProps = {
  children: React.ReactNode;
  className?: string;
}

function WrapperModal({ children, className }: WrapperModalProps) {
  return (
    <div className={`wrapper-modal ${className}`}>
      {children}
    </div>
  )
}

export default WrapperModal
