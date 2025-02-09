import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { CurrencySwapPage } from './pages';
import { ToastComponent } from './components';
import { ToastProvider } from './contexts';

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <CurrencySwapPage />
        <ToastComponent />
      </div>
    </ToastProvider>
  );
}

export default App;
