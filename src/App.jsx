import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import UploadPreview from './components/UploadPreview';
import './components/Layout.css';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <UploadPreview />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
