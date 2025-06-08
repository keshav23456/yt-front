import React from 'react';
import { Header, Sidebar } from '../common';
import './Layout.css';

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout-content">
        {showSidebar && <Sidebar />}
        <main className={`main-content ${!showSidebar ? 'full-width' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;