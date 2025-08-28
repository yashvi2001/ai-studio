import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider } from './context/AppStateContext';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppStateProvider>
          <Layout />
        </AppStateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
