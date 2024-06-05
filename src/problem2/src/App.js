import './App.css';
import CurrencyConvertor from './components/CurrencyConvertor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center'>
      <CurrencyConvertor />
      <ToastContainer theme='dark' />
    </div>
  );
}

export default App;
