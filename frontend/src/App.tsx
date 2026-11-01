import { Outlet } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Header from "./components/Header";
import Footer from './components/Footer';
import { useTheme } from './components/ThemeProvider';

function App() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='mx-auto w-full max-w-6xl flex-1 px-4 py-8'>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer theme={resolvedTheme} />
    </div>
  );
}

export default App;
