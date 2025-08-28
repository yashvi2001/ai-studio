import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider } from './context/AppStateContext';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <Layout />
      </AppStateProvider>
    </ThemeProvider>
  );
};

export default App;
