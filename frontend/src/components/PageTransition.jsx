import React from 'react';

const PageTransition = ({ children }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
      {children}
    </div>
  );
};

export default PageTransition;
