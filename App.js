import './App.css';
import './assets/CSS/flood.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AllRoutes } from './routes/AllRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  
  return (
    <AuthProvider>
      <AllRoutes />
    </AuthProvider>
  );
}

export default App;
