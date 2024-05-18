import React from "react";

type BaseModalProps = {
  children: React.ReactNode;
  className?: string;
};

function BaseModal({ children, className }: BaseModalProps) {
  return (
    <div className={`base-modal ${className}`}>
      {children}
    </div>
  );
}

export default BaseModal;
