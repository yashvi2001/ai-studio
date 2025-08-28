import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { ImageStudio } from './components/ImageStudio';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Layout>
        <ImageStudio />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
