import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <img src="/assets/logo.png" alt="Logo" className="auth-logo" />
          {title && <h1 className="auth-title">{title}</h1>}
        </div>
        <div className="auth-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;