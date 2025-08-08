import React from 'react';
import { ReactQueryProvider } from '@/lib/react-query/provider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  );
};

export default Layout;